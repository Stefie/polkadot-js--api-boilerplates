import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

import {
  ALICE, createButton, createLog, createError, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/promise/06_make_transfer/
export default (provider) => {
  const wrapper = createWrapper('make-transfer', 'Promise - Make Transfer');
  const makeTransfer = async (provider) => {
    try {
      // Create our API with a connection to the node
      const api = await ApiPromise.create(provider);
      // Get a random number between 1 and 100000
      const randomAmount = Math.floor((Math.random() * 100000) + 1);

      // Create an instance of the keyring
      const keyring = new Keyring({ type: 'sr25519' });

      // Add Bob to keyring
      const bob = keyring.addFromUri('//Bob');
      // Create a extrinsic, transferring randomAmount units to Bob.
      // We can also create sign and send in two operations.
      const transfer = api.tx.balances.transfer(ALICE, randomAmount);
      // Sign and Send the transaction
      transfer.signAndSend(bob, ({ status }) => {
        if (status.type === 'Finalized') {
          createLog(`Successful transfer of ${randomAmount} from <b>Alice</b> to <b>Bob</b> with hash ${status.asFinalized.toHex()}`, wrapper);
        } else {
          createLog(`Status of transfer: ${status.type}`, wrapper);
        }
      });
    } catch (e) {
      createError(e, wrapper);
    }
  };
  createButton(makeTransfer, wrapper, 'Initialize transfer');
};
