'use strict';

const RPC = require('@hyperswarm/rpc');
const DHT = require('hyperdht');
const Hypercore = require('hypercore');
const Hyperbee = require('hyperbee');
const crypto = require('crypto');
const Auction = require('./src/auction');
const Network = require("./src/network");

const main = async () => {
    const network = new Network();
   
  // hyperbee db
  const hcore = new Hypercore('./db/rpc-client');
  const hbee = new Hyperbee(hcore, { keyEncoding: 'utf-8', valueEncoding: 'binary' });
  await hbee.ready();

  // resolved distributed hash table seed for key pair
  let dhtSeed = (await hbee.get('dht-seed'))?.value;
  if (!dhtSeed) {
    // not found, generate and store in db
    dhtSeed = crypto.randomBytes(32);
    await hbee.put('dht-seed', dhtSeed);
  }

  // start distributed hash table, it is used for rpc service discovery
  const dht = new DHT({
    port: 50001,
    keyPair: DHT.keyPair(dhtSeed),
    bootstrap: [{ host: '127.0.0.1', port: 30001 }] // note boostrap points to dht that is started via cli
  });
  await dht.ready();

  // public key of rpc server, used instead of address, the address is discovered via dht
  const serverPubKey = Buffer.from('050bf3aef016d4b2f1e67640a7fb31d6ef973aa971c208f67df9b5dbba4bdc07', 'hex');

  // rpc lib
  const rpc = new RPC({ dht });

  // payload for request
  const openAuctionPayload = {
    item: 'Pic#1',
    price: 75,
    endDate: new Date(Date.now()),
    network: { port: 50001, keyPair: DHT.keyPair(dhtSeed) }
  };

  const openAuctionPayloadRaw = Buffer.from(JSON.stringify(openAuctionPayload), 'utf-8');

  // sending request and handling response 
  //- opening auction
    const resRaw = await rpc.request(serverPubKey, 'openAuction', openAuctionPayloadRaw);
    const res = JSON.parse(resRaw.toString('utf-8'));
    console.log('Auction opened:', res);


  // closing connection
  await rpc.destroy();
  await dht.destroy();
};

main().catch(console.error);
