import { ApiRx } from '@polkadot/api';
import { pairwise, startWith } from 'rxjs/operators';
import {
  BOB, createLog, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/rx/03_listen_to_balance_change/
export default async (provider) => {
  const wrapper = createWrapper('listen-to-balance-change', 'Rx - Listen to Alice Balance Change');

  const api = await ApiRx.create(provider).toPromise();

  // Here we subscribe to any balance changes and update the on-screen value.
  // We're using RxJs pairwise() operator to get the previous and current values as an array.
  api.query.balances.freeBalance(BOB)
    .pipe(
      // since pairwise only starts emitting values on the second emission, we prepend an
      // initial value with the startWith() operator to be able to also receive the first value
      startWith('first'),
      pairwise()
    )
    .subscribe((balance) => {
      if (balance[0] === 'first') {
        // Now we know that if the previous value emitted as balance[0] is `first`,
        // then balance[1] is the initial value of Alice account.
        createLog(`<b>Bob</b> ${BOB} has a balance of ${balance[1]}`, wrapper);
        createLog('You may leave this example running and start the "Make a transfer" example or transfer any value to Bobs address', wrapper);
        return;
      }
      const change = balance[1].sub(balance[0]);
      // Only display value changes
      if (!change.isZero()) {
        createLog(`New balance change of: ${change}`, wrapper);
      }
    });
};
