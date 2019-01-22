import { first, switchMap, tap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { ApiRx } from '@polkadot/api';
import {
  ALICE, createLog, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/rx/05_read_storage/
export default (provider) => {
  const wrapper = createWrapper('read-storage', 'Rx - Read Chain State');

  new ApiRx(provider).isReady
    .pipe(
      // Here we ake our basic chain state/storage queries, all in one go
      switchMap((api) => combineLatest(
        // We're combining the results together with the emitted value 'api',
        // which we're turning back into an observable using of()
        of(api),
        api.query.session.validators().pipe(first()),
        api.query.system.accountNonce(ALICE).pipe(first()),
        api.query.timestamp.blockPeriod().pipe(first())
      )),
      tap(([,, accountNonce, blockPeriod]) => {
        // We're using tap() to print out the results of our account nonce and block period queries
        createLog(`Account Alice: ${ALICE} <br />AccountNonce: ${accountNonce}`, wrapper);
        createLog(`blockPeriod ${blockPeriod.toNumber()} seconds`, wrapper);
      }),
      switchMap(([api, validators]) => {
        // In the next step, we're checking if the node has active validators.
        // If it does, we're making another call to the api to get the balances for all validators
        const balances = (validators && validators.length > 0)
          ? combineLatest(validators.map(authorityId => api.query.balances.freeBalance(authorityId).pipe(first())))
          : of(null);
        // If there are no validators, we're not returning any balances
        return combineLatest(
          of(validators),
          balances
        );
      })
    )
    // Then we're subscribing to the emitted results
    .subscribe(([validators, validatorBalances]) => {
      if (validatorBalances) {
        createLog('Validators:', wrapper, 'highlight');
        // And lastly we print out the authorityIds and balances of all validators
        validators.forEach((authorityId, index) => {
          createLog(`Validator: ${authorityId.toString()} <br />Balance: ${validatorBalances[index].toString()}`, wrapper);
        });
      }
    });
};
