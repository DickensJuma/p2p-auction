# P2P Auction System

The P2P Auction System facilitates decentralized auctions using Hyperswarm RPC and Hypercores. This project enables peers to create and join auctions within a `peer-to-peer` network, eliminating the need for a central server.

## Features
- `Decentralized Auctions`: Peer can create and manage auctions directly within the P2P network.
- `Peer Discovery`: Utilizes Hyperswarm for peer discovery, enabling nodes to discover and connect to each other.
- `Bidding System`: Participants can place bids on items being auctioned.
- `Auction Closing`: Supports the closing of auctions and determines the winning bid.


## Installation
1. Clone the repository:

```
git clone https://github.com/yourusername/p2p-auction.git
```
2. Install dependencies:

```
cd p2p-auction
npm install
```
3. Run the application:

```
npm start
```

## Usage
- `Open Auction`: Use the open method to initiate a new auction, specifying the item name and starting price.

- `Submit Bid`: Utilize the submitBid method to place a bid on an ongoing auction, providing the bidder's name and bid amount.

- `Close Auction`: Upon the auction's conclusion, call the close method to finalize the auction and determine the winning bid.


## Example

```

const Auction = require('./auction');

// Create a new auction
const item1Auction = new Auction('Pic#1', 75);

// Open the auction
item1Auction.open(network);

// Submit bids
item1Auction.submitBid(network, 'Client#1', 80);
item1Auction.submitBid(network, 'Client#2', 85);

// Close the auction
item1Auction.close('Client#2');

```

## Contributors
- [holepunch.to](https://docs.holepunch.to/building-blocks/hyperswarm)


## License
This project is licensed under the MIT License# p2p-auction
