const Hypercore = require("hypercore");
const crypto = require("crypto");

class Auction {
  constructor(item, startingPrice, endDate) {
    this.id = crypto.randomBytes(16).toString("hex");
    this.item = item;
    this.startingPrice = startingPrice;
    this.endDate = endDate;
    this.currentBid = { bidder: null, amount: startingPrice };
    this.closed = false;
    this.bids = [];
    this.core = new Hypercore(`auction-${this.id}`, { valueEncoding: "json" });
  }

  async openAuction(network) {
    const auctionDetails = {
      id: this.id,
      item: this.item,
      startingPrice: this.startingPrice,
      endDate: this.endDate,
      type: "auctionOpened",
    };

    try {
      await this.core.append(auctionDetails);
      network.broadcast(this.item, JSON.stringify(auctionDetails));
      console.log(
        `Auction ${this.id} opened for ${this.item} at ${this.startingPrice} USDt`
      );
    } catch (err) {
      console.error("Error opening auction:", err);
    }
  }

  async submitBid(network, bidder, amount) {
    if (this.closed) {
      console.log(`Auction ${this.id} is closed. Bids are no longer accepted.`);
      return;
    }

    if (amount <= this.currentBid.amount) {
      console.log(
        `Bid amount must be higher or equal than the current highest bid (${this.currentBid.amount} USDt).`
      );
      return;
    }

    const bid = { bidder, amount, timestamp: new Date().toISOString() };
    try {
      this.bids.push(bid);
      this.currentBid = { bidder, amount };
      network.broadcast(
        this.item,
        JSON.stringify({ type: "bidSubmitted", bid })
      );
      await this.core.append({ type: "bidSubmitted", bid });
      console.log(
        `Bid submitted for ${this.item} by ${bidder} at ${amount} USDt`
      );
    } catch (err) {
      console.error("Error submitting bid:", err);
    }
  }

  async closeAuction(network) {
    if (this.closed) {
      console.log(`Auction ${this.id} is already closed..`);
      return;
    }

    if (Date.now() >= this.endDate) {
      this.closed = true;
      console.log(`Auction ${this.id} is closed.`);

      const winningBid = this.bids.length > 0 ? this.currentBid : null;
      console.log(
        `Winner of auction ${this.id}: ${
          winningBid ? winningBid.bidder : "No bids"
        }`
      );

      const auctionDetails = {
        id: this.id,
        item: this.item,
        startingPrice: this.startingPrice,
        endDate: this.endDate,
        winningBid: winningBid,
        type: "auctionClosed",
      };

      try {
        await this.core.append(auctionDetails);
        network.broadcast(this.item, JSON.stringify(auctionDetails));
      } catch (err) {
        console.error("Error closing auction:", err);
      }
    } else {
      console.log(
        `Auction ${this.id} is still open until ${new Date(
          this.endDate
        ).toLocaleString()}`
      );
    }
  }
}

module.exports = Auction;
