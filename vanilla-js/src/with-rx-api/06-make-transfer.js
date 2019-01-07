import { switchMap } from 'rxjs/operators';
import { ApiRx } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';

import {
  BOB, createElement, createWrapper,
} from '../commons';

export default async (provider) => {
  const wrapper = createWrapper('06-make-transfer', 'Rx - Make Transfer');
  const ALICE_SEED = 'Alice'.padEnd(32, ' ');
  // Create an instance of the keyring
  const keyring = new Keyring();
  // Add Alice to our keyring (with the known seed for the account
  const alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
  //  Instantiate the API
  const api = await ApiRx.create(provider).toPromise();
  // @TODO Rewrite Example. This one transfers the given amount on every new block
  // retrieve nonce for the account
  api.query.system.accountNonce(alice.address()).pipe(
    // pipe nonce into transfer
    switchMap(nonce => api.tx.balances
    // create transfer
      .transfer(BOB, 12345)
    // sign the transcation
      .sign(alice, nonce || 0) // Bug in ApiRx, returns null before first transaction on new chain
    // send the transaction
      .send()),
  )
    // subscribe to overall result
    .subscribe((hash) => {
      createElement(`Transfer 12345 from <b>Alice</b> to <b>Bob</b> with hash ${hash}`, wrapper);
    });
};
