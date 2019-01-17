import { ApiRx } from '@polkadot/api';
import { switchMap, first } from 'rxjs/operators';

import {
  ALICE, createButton, createLog, createWrapper
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
    // create an instance of our testign keyring
    const keyring = testKeyring();
    // find the actual keypair in the keyring
    const alicePair = keyring.getPair(ALICE);
    // create a new random recipient
    const recipient = keyring.addFromSeed(randomAsU8a(32)).address();

    // get the nonce for the admin key
    api.query.system.accountNonce(ALICE).pipe(first(),
      // pipe nonce into transfer
      switchMap(aliceNonce => api.tx.balances
        // create transfer
        .transfer(recipient, randomAmount)
        // sign the transcation
        .sign(alicePair, aliceNonce)
        // send the transaction
        .send()))
      // subscribe to overall result
      .subscribe(({ events = [], status, type }) => {
        // Log transfer events
        createLog(`Transaction status: ${type}`, wrapper);
        if (type === 'Ready') {
          createLog(`Sending ${randomAmount} from ${alicePair.address()} to ${recipient}`, wrapper);
        }
        if (type === 'Finalised') {
          createLog(`Completed at block hash: ${status.value.toHex()}`, wrapper);
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
