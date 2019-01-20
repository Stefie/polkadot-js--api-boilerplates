import { ApiRx } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';

import {
  BOB, createButton, createLog, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/rx/06_make_transfer/
export default (provider) => {
  const wrapper = createWrapper('make-transfer', 'Rx - Make Transfer');
  const makeTransfer = async provider => {
    // Get Alice seed
    const ALICE_SEED = 'Alice'.padEnd(32, ' ');
    // Create an instance of the keyring
    const keyring = new Keyring();
    // Add Alice to our keyring (with the known seed for the account
    const alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
    //  Instantiate the API
    const api = await ApiRx.create(provider).toPromise();
    // Get a random number between 1 and 100000
    const randomAmount = Math.floor((Math.random() * 100000) + 1);

    api.tx.balances
      // create transfer
      .transfer(BOB, randomAmount)
      // Sign and send the transcation
      .signAndSend(alice)
      // Subscribe to the status updates of the transfer
      .subscribe(({ status, type }) => {
        if (type === 'Finalised') {
          createLog(`Successful transfer of ${randomAmount} from <b>Alice</b> to <b>Bob</b> with hash ${status.asFinalised.toHex()}`, wrapper);
        } else {
          createLog(`Staus of transfer: ${type}`, wrapper);
        }
      });
  };
  createButton(makeTransfer, wrapper, 'Initialize transfer');
};
