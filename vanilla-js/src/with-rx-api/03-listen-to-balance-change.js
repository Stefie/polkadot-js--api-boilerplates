import { ApiRx } from '@polkadot/api';
import { first } from 'rxjs/operators';
import {
  ALICE, createLog, createWrapper
} from '../commons';

export default (provider) => {
  const wrapper = createWrapper('listen-to-balance-change', 'Rx - Listen to Alice Balance Change');

  ApiRx.create(provider).subscribe(async (api) => {
    // Retrieve the initial balance. Since the call has no callback, we can use the toPromise()
    // method on the observable together with the first() operator.
    let previous = await api.query.balances.freeBalance(ALICE).pipe(first()).toPromise();

    createLog(`<b>Alice</b> ${ALICE} has a balance of ${previous}`, wrapper);
    createLog('You may leave this example running and start the "Make a transfer" example or transfer any value to Alice address', wrapper);

    // Here we subscribe to any balance changes and update the on-screen value
    api.query.balances.freeBalance(ALICE).subscribe((balance) => {
      // Calculate the delta
      const change = balance.sub(previous);
      // Only display positive value changes (Since we are pulling `previous` above already,
      // the initial balance change will also be zero)
      if (change.isZero()) {
        return;
      }
      previous = balance;
      createLog(`Transaction: ${change}`, wrapper);
    });
  });
};
