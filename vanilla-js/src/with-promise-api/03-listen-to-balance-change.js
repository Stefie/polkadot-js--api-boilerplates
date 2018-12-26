import { ApiPromise } from '@polkadot/api';
import {
  ALICE, createElement, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/promise/03_listen_to_balance_change/
export default async (provider) => {
  const wrapper = createWrapper('03-listen-to-balance-change');
  // Create an await for the API
  const api = await ApiPromise.create(provider);
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
