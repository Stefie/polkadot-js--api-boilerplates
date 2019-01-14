import { ApiPromise } from '@polkadot/api';
// import the test keyring (already has dev keys for Alice, Bob, Charlie, Eve & Ferdie)
import testKeyring from '@polkadot/keyring/testing';
// utility function for random values
// import { compactAddLength, hexToU8a } from '@polkadot/util';
import {
// createButton, createLog, createError, createWrapper
} from '../commons';
// import fs from 'fs';
const fs = require('fs');

const codec = fs.open('./../wasm/09-upgrade-example-test.wasm').toString('hex');
console.log('codec', codec);

// https://polkadot.js.org/api/examples/promise/09_upgrade_with_sudo/
export default async (provider) => {
  // const wrapper = createWrapper('09-upgrade-with-sudo', 'Rx - Upgrade Runtime with sudo');

  // Create the API and wait until ready (optional provider passed through)
  const api = await ApiPromise.create(provider);

  // retrieve the upgrade key from the chain state
  const adminId = await api.query.sudo.key();

  // get the nonce for the admin key
  const adminNonce = await api.query.system.accountNonce(adminId);

  // find the actual keypair in the keyring (if this is an changed value, the key
  // needs to be added to the keyring before - this assumes we have defaults, i.e.
  // Alice as the key - and this already exists on the test keyring)
  const keyring = testKeyring();
  const adminPair = keyring.getPair(adminId.toString());

  // retrieve the runtime to upgrade to
  const code = fs.readFileSync('./../wasm/09-upgrade-example-test.wasm').toString('hex');
  const proposal = api.tx.consensus.setCode(`0x${code}`);

  console.log(`Upgrading from ${adminId} with nonce ${adminNonce}, ${code.length / 2} bytes`);

  // preform the actual chain upgrade via the sudo module
  api.tx.sudo
    .sudo(proposal)
    .sign(adminPair, adminNonce)
    .send(({ events = [], status, type }) => {
      console.log('Transaction status:', type);

      if (type === 'Finalised') {
        console.error('You have just upgraded your chain');

        console.log('Completed at block hash', status.value.toHex());
        console.log('Events:');

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
        });

        process.exit(0);
      }
    });
};
