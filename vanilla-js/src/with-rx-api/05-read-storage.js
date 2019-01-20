import { first } from 'rxjs/operators';
import { zip } from 'rxjs';
import { ApiRx } from '@polkadot/api';
import {
  ALICE, createLog, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/rx/05_read_storage/
export default (provider) => {
  const wrapper = createWrapper('read-storage', 'Rx - Read Chain State');

  ApiRx.create(provider).subscribe(async (api) => {
    // We're using RxJs 'zip()' combination operator together with first()
    // to get the first emitted values of multiple observables as an array
    zip(
      api.query.system.accountNonce(ALICE).pipe(first()),
      api.query.timestamp.blockPeriod().pipe(first()),
      api.query.session.validators().pipe(first())
    )
    // Then we're subscribing to the emitted results
      .subscribe(([accountNonce, blockPeriod, validators]) => {
        createLog(`Account Alice: ${ALICE} <br />AccountNonce: ${accountNonce}`, wrapper);
        createLog(`blockPeriod ${blockPeriod.toNumber()} seconds`, wrapper);

        // If the node has active validators
        if (validators && validators.length > 0) {
          createLog('Validators', wrapper, 'highlight');

          // We're getting the the balances of all validators, again using 'zip()'
          validators.map(authorityId => zip(
            api.query.balances.freeBalance(authorityId).pipe(first())
          ).subscribe(validatorBalances => {
            // And lastly log each validators ID and their balance
            validators.forEach((authorityId, index) => {
              createLog(`Validator: ${authorityId.toString()} <br />Balance: ${validatorBalances[index].toString()}`, wrapper);
            });
          }));
        }
      });
  });
};
