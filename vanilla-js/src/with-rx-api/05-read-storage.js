import { first, switchMap } from 'rxjs/operators';
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
      switchMap((api) => combineLatest(
        of(api),
        api.query.session.validators().pipe(first())
      )),
      switchMap(([api, validators]) => {
        // If the node has active validators, get the balances
        const balances = (validators && validators.length > 0)
          ? combineLatest(validators.map(authorityId => api.query.balances.freeBalance(authorityId).pipe(first())))
          : null;

        // If there are no validators, we're not returning any balances
        return combineLatest(
          api.query.system.accountNonce(ALICE).pipe(first()),
          api.query.timestamp.blockPeriod().pipe(first()),
          of(validators),
          balances
        );
      })
    )
    // Then we're subscribing to the emitted results
    .subscribe(([accountNonce, blockPeriod, validators, validatorBalances]) => {
      createLog(`Account Alice: ${ALICE} <br />AccountNonce: ${accountNonce}`, wrapper);
      createLog(`blockPeriod ${blockPeriod.toNumber()} seconds`, wrapper);

      if (validatorBalances) {
        createLog('Validators:', wrapper, 'highlight');
        // And lastly we're subscribing to the observable and print out
        // the authorityIds and balances of all validators
        validators.forEach((authorityId, index) => {
          createLog(`Validator: ${authorityId.toString()} <br />Balance: ${validatorBalances[index].toString()}`, wrapper);
        });
      }
    });
};
