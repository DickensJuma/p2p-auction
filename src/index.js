const Network = require("./network");
const Auction = require("./auction");

/* 
      ============= WORKING FINE =============
  This is the main file that will be used to run the auction system.
  It creates a network, and two auctions, and then opens the auctions.
  It then submits bids to the auctions and closes the auctions.
*/


async function run() {
  const network = new Network();

  const item1Auction = new Auction("Pic#1", 75, new Date(Date.now()));
  //const item2Auction = new Auction("Pic#2", 60, new Date(Date.now()))

  const topic1 = Buffer.alloc(32).fill("Pic#1");
  // const topic2 = Buffer.alloc(32).fill("Pic#2");

  await network.join(topic1, { server: true, client: true });
  //await network.join(topic2, { server: true, client: true });

  item1Auction.openAuction(network);
  //item2Auction.openAuction(network);

  item1Auction.submitBid(network, "Client#2", 75);
  item1Auction.submitBid(network, "Client#3", 75.5);
  item1Auction.submitBid(network, "Client#2", 80);
  // item1Auction.submitBid(network, "Client#3", 85)
  // item1Auction.submitBid(network, "Client#2", 85)
  // item1Auction.submitBid(network, "Client#3", 90)

  //closing the auction
  item1Auction.closeAuction(network);
}

run().catch(console.error);
