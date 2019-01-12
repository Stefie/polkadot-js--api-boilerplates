import { switchMap, first } from 'rxjs/operators';
import { ApiRx } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';

import {
  BOB, createButton, createLog, createWrapper
} from '../commons';

export default (provider) => {
  const wrapper = createWrapper('06-make-transfer', 'Rx - Make Transfer');
  const makeTransfer = async provider => {
    const ALICE_SEED = 'Alice'.padEnd(32, ' ');
    // Create an instance of the keyring
    const keyring = new Keyring();
    // Add Alice to our keyring (with the known seed for the account
    const alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
    //  Instantiate the API
    const api = await ApiRx.create(provider).toPromise();
    // Get a random number between 1 and 100000
    const randomAmount = Math.floor((Math.random() * 100000) + 1);

    // retrieve nonce for the account
    api.query.system.accountNonce(alice.address()).pipe(first(),
      // pipe nonce into transfer
      switchMap(nonce => api.tx.balances
        // create transfer
        .transfer(BOB, randomAmount)
        // sign the transcation
        .sign(alice, nonce)
        // send the transaction
        .send()))
    // subscribe to overall result
      .subscribe((hash) => {
        if (hash.status.raw.length === 32) {
          createLog(`Successful transfer of ${randomAmount} from <b>Alice</b> to <b>Bob</b> with hash ${hash.status.raw}`, wrapper);
        } else {
          createLog(`Pending transfer of ${randomAmount} from <b>Alice</b> to <b>Bob</b>`, wrapper);
        }
      });
  };
  createButton(makeTransfer, wrapper, 'Initialize transfer');
};
