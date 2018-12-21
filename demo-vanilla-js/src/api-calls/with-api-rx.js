import { ApiRx } from '@polkadot/api';

import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';
import {
  ALICE, BOB, createElement, createWrapper
} from './commons';

export const simpleConnect = async (provider) => {
  const wrapper = createWrapper('simple-connect', 'Simple Connect');
  // Retrieve the chain & node information information via rpc calls
  const api = await ApiRx.create(provider).toPromise();
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);
  createElement(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`, wrapper);
};

export const listenToBlocks = async (provider) => {
  const wrapper = createWrapper('listen-to-blocks');
  const api = await ApiRx.create(provider).toPromise();
  const subscriptionId = api.rpc.chain.subscribeNewHead().subscribe((header) => {
    createElement(`Chain is at #${header.blockNumber}`, wrapper);
  });
  createElement(`SubsciptionId: ${subscriptionId}`, wrapper);
  console.log('subscriptionId', subscriptionId);
};

export const makeTransfer = async (provider) => {
  const wrapper = createWrapper('make-transfer');
  const ALICE_SEED = 'Alice'.padEnd(32, ' ');
  // Create an instance of the keyring
  const keyring = new Keyring();
  // Add Alice to our keyring (with the known seed for the account)
  const alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
  // Instantiate the API
  const api = await ApiRx.create(provider).toPromise();
  // Retrieve the nonce for Alice, to be used to sign the transaction
  const aliceNonce = await api.query.system.accountNonce.subscribe(alice.address());
  // Create a extrinsic, transferring 12345 units to Bob. We can also create,
  // sign and send in one operation (as per the samples in the Api documentation),
  // here we split it out for the sake of readability
  const transfer = api.tx.balances.transfer(BOB, 12345);
  // Sign the transaction using our account
  transfer.sign(alice, aliceNonce);
  // Send the transaction and retrieve the resulting Hash
  const hash = await transfer.send();
  createElement(`Transfer 12345 from <b>Alice</b> to <b>Bob</b> with hash ${hash}`, wrapper);
};
