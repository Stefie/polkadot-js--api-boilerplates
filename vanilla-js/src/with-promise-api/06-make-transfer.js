import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';

import {
  BOB, createElement, createError, createWrapper,
} from '../commons';

export default async (provider) => {
  const wrapper = createWrapper('06-make-transfer', 'Promise - Make Transfer');
  try {
    // Create our API with a connection to the node
    const api = await ApiPromise.create(provider);
    const ALICE_SEED = 'Alice'.padEnd(32, ' ');
    // Create an instance of the keyring
    const keyring = new Keyring();
    // Add Alice to our keyring (with the known seed for the account)
    const alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
    // Instantiate the API
    // const api = await ApiPromise.create(provider);
    // Retrieve the nonce for Alice, to be used to sign the transaction
    const aliceNonce = await api.query.system.accountNonce(alice.address());
    // Create a extrinsic, transferring 12345 units to Bob. We can also create,
    // sign and send in one operation (as per the samples in the Api documentation),
    // here we split it out for the sake of readability
    const transfer = api.tx.balances.transfer(BOB, 12345);
    // Sign the transaction using our account
    transfer.sign(alice, aliceNonce);
    // Send the transaction and retrieve the resulting Hash
    const hash = await transfer.send();
    createElement(`Transfer 12345 from <b>Alice</b> to <b>Bob</b> with hash ${hash}`, wrapper);
  } catch (e) {
    createError(e, wrapper);
  }
};
