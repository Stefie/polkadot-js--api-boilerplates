
import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';
import {
  ALICE, BOB, createElement, createWrapper
} from './commons';

// https://polkadot.js.org/api/examples/promise/01_simple_connect/
export const simpleConnect = async (provider) => {
  const wrapper = createWrapper('simple-connect', 'Simple Connect');
  // Retrieve the chain & node information information via rpc calls
  const api = await ApiPromise.create(provider);
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);
  createElement(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`, wrapper);
};

// https://polkadot.js.org/api/examples/promise/02_listen_to_blocks/
export const listenToBlocks = async (provider) => {
  const wrapper = createWrapper('listen-to-blocks');
  const api = await ApiPromise.create(provider);
  const subscriptionId = await api.rpc.chain.subscribeNewHead((header) => {
    createElement(`Chain is at block: #${header.blockNumber}`, wrapper);
  });
  createElement(`SubsciptionId: ${subscriptionId}`, wrapper);
};

// https://polkadot.js.org/api/examples/promise/03_listen_to_balance_change/
export const listenToBalanceChange = async (provider) => {
  const wrapper = createWrapper('listen-to-balance-change');
  // Create an await for the API
  const api = await ApiPromise.create();
  // Retrieve the initial balance. Since the call has no callback, it is simply a promise
  // that resolves to the current on-chain value
  let previous = await api.query.balances.freeBalance(ALICE);
  createElement(`<b>Alice</b> ${ALICE} has a balance of ${previous}`, wrapper);
  createElement(`You may leave this example running and start the "Make a transfer" example or transfer any value to Alice address`, wrapper);

  // Here we subscribe to any balance changes and update the on-screen value
  api.query.balances.freeBalance(ALICE, (current) => {
    // Calculate the delta
    const change = current.sub(previous);
    // Only display positive value changes (Since we are pulling `previous` above already,
    // the initial balance change will also be zero)
    if (change.isZero()) {
      return;
    }
    previous = current;
    createElement(`Transaction: ${change}`, wrapper);
  });
};

// https://polkadot.js.org/api/examples/promise/05_read_storage/
export const readChainState = async (provider) => {
  const wrapper = createWrapper('read-chain-state');
  // Create our API with a default connection to the local node
  const api = await ApiPromise.create();
  // Make our basic chain state/storage queries, all in one go
  const [accountNonce, blockPeriod, validators] = await Promise.all([
    api.query.system.accountNonce(ALICE),
    api.query.timestamp.now(),
    api.query.session.validators()
  ]);
  createElement(`accountNonce(${ALICE}) ${accountNonce}`, wrapper);
  createElement(`blockPeriod ${blockPeriod.toNumber()} seconds`, wrapper);
  // Retrieve the balances for all validators
  const validatorBalances = await Promise.all(
    validators.map(authorityId => api.query.balances.freeBalance(authorityId))
  );
  if (validators.length > 0) {
    const string = validators.map((authorityId, index) => ({
      address: authorityId.toString(),
      balance: validatorBalances[index].toString()
    }));
    console.log('string', string);
    createElement(string, wrapper);
    // createElement('validators', validators.map((authorityId, index) => ({
    //   address: authorityId.toString(),
    //   balance: validatorBalances[index].toString()
    // })), wrapper);
  }
};

export const makeTransfer = async (provider) => {
  const wrapper = createWrapper('make-transfer');
  const ALICE_SEED = 'Alice'.padEnd(32, ' ');
  // Create an instance of the keyring
  const keyring = new Keyring();
  // Add Alice to our keyring (with the known seed for the account)
  const alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
  // Instantiate the API
  const api = await ApiPromise.create();
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
};

export const displaySystemEvents = async (provider) => {
  const wrapper = createWrapper('display-system-events');
  // Create our API with a default connection to the local node
  const api = await ApiPromise.create();
  // subscribe to system events via storage
  api.query.system.events((events) => {
    createElement(`-------- Received ${events.length} events: --------`, wrapper, 'highlight');
    // loop through the Vec<EventRecord>
    events.forEach((record) => {
      // extract the phase, event and the event types
      const { event, phase } = record;
      const types = event.typeDef;
      // show what we are busy with
      createElement(`${event.section}:${event.method}:: (phase=${phase.toString()})`, wrapper);
      createElement(`\t${event.meta.documentation.toString()}`, wrapper);
      // loop through each of the parameters, displaying the type and data
      event.data.forEach((data, index) => {
        createElement(`\t\tt${types[index].type}: ${data.toString()}`, wrapper);
      });
    });
    createElement(`-------- End ${events.length} events: --------------`, wrapper, 'console');
  });
};
