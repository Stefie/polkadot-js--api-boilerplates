import { ApiRx } from '@polkadot/api';

import {
  BOB, createButton, createLog, createWrapper
} from '../commons';
// import the test keyring (already has dev keys for Alice, Bob, Charlie, Eve & Ferdie)
import testKeyring from '@polkadot/keyring/testing';
// utility function for random values
import { randomAsU8a } from '@polkadot/util-crypto';

// https://polkadot.js.org/api/examples/rx/09-transfer-events/
export default async (provider) => {
  const wrapper = createWrapper('transfer-events', 'Rx - Transfer Events');

  const makeTransfer = async provider => {
    // Create our API with a connection to the node
    const api = await ApiRx.create(provider).toPromise();

    // Get a random amount between 1 and 100000
    const randomAmount = Math.floor((Math.random() * 100000) + 1);

    // create an instance of our testing keyring
    const keyring = testKeyring();
    // find the actual keypair in the keyring
    const bobPair = keyring.getPair(BOB);
    // create a new random recipient
    const recipient = keyring.addFromSeed(randomAsU8a(32)).address();

    // Create a extrinsic, transferring randomAmount units to randomAccount.
    api.tx.balances
    // Do the transfer
      .transfer(recipient, randomAmount)
    // Sign and send it
      .signAndSend(bobPair)
    // And subscribe to the actual status
      .subscribe(({ events = [], status }) => {
        // Log transfer events
        createLog(`Transfer status: ${status.type}`, wrapper);
        if (status.type === 'Ready') {
          createLog(`Transfer of ${randomAmount} to ${recipient} is ready to be processed`, wrapper);
        }
        // Log system events once the transfer is Finalized
        if (status.type === 'Finalized') {
          createLog(`Completed at block hash: ${status.asFinalized.toHex()}`, wrapper);
          createLog(`Events:`, wrapper, 'highlight');
          events.forEach(({ phase, event: { data, method, section } }) => {
            createLog(`${phase.toString()}: ${section}.${method} ${data.toString()}`, wrapper);
          });
          createLog('------------------------', wrapper, 'highlight');
        }
      });
  };
  createButton(makeTransfer, wrapper, 'Initialize transfer');
};
