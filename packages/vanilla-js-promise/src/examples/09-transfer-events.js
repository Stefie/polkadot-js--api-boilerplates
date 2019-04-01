import { ApiPromise } from '@polkadot/api';

import {
  BOB, createButton, createLog, createError, createWrapper
} from '../commons';
// import the test keyring (already has dev keys for Alice, Bob, Charlie, Eve & Ferdie)
import testKeyring from '@polkadot/keyring/testing';
// utility function for random values
import { randomAsU8a } from '@polkadot/util-crypto';

// https://polkadot.js.org/api/examples/promise/09-transfer-events/
export default (provider) => {
  const wrapper = createWrapper('transfer-events', 'Promise - Transfer Events');
  const makeTransfer = async (provider) => {
    try {
      // Create our API with a connection to the node
      const api = await ApiPromise.create(provider);
      // Get a random amount between 1 and 100000
      const randomAmount = Math.floor((Math.random() * 100000) + 1);
      // create an instance of our testing keyring
      const keyring = testKeyring();

      // get the nonce for Bobs account
      const bobNonce = await api.query.system.accountNonce(BOB);
      // find the actual keypair in the keyring
      const bobPair = keyring.getPair(BOB);
      // create a new random recipient
      const recipient = keyring.addFromSeed(randomAsU8a(32)).address();
      createLog(`Sending ${randomAmount} from ${bobPair.address()} to ${recipient} with nonce ${bobNonce.toString()}`, wrapper);
      // Create a extrinsic, transferring randomAmount units to randomAccount.
      api.tx.balances
        .transfer(recipient, randomAmount)
        .signAndSend(bobPair, ({ events = [], status }) => {
          console.log('status', status);
          // Log transfer events
          createLog(`Transaction status: ${status.type}`, wrapper);
          if (status.type === 'Finalized') {
            createLog(`Completed at block hash: ${status.asFinalized.toHex()}`, wrapper);
            createLog(`Events:`, wrapper, 'highlight');
            events.forEach(({ phase, event: { data, method, section } }) => {
              createLog(`${phase.toString()}: ${section}.${method} ${data.toString()}`, wrapper);
            });
            createLog('------------', wrapper, 'highlight');
          }
        });
    } catch (e) {
      createError(e, wrapper);
    }
  };
  createButton(makeTransfer, wrapper, 'Initialize transfer');
};
