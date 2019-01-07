import { first } from 'rxjs/operators';
import { ApiRx } from '@polkadot/api';
import {
  ALICE, createElement, createWrapper,
} from '../commons';

export default (provider) => {
  const wrapper = createWrapper('05-read-chain-state', 'Rx - Read Chain State');

  ApiRx.create(provider).subscribe(async (api) => {
    // Use toPromise() with async/await to emit the last Observable value as a Promise
    const [accountNonce, blockPeriod, validators] = await Promise.all([
      api.query.system.accountNonce(ALICE).pipe(first()).toPromise(),
      api.query.timestamp.now().pipe(first()).toPromise(),
      api.query.session.validators().pipe(first()).toPromise(),
    ]);

    createElement(`Account: ${ALICE} <br />AccountNonce: ${accountNonce}`, wrapper);
    createElement(`blockPeriod ${blockPeriod.toNumber()} seconds`, wrapper);

    if (validators && validators.length > 0) {
      createElement('Validators', wrapper, 'highlight');
      // Retrieve the balances for all validators
      const validatorBalances = await Promise.all(
        validators.map(authorityId => api.query.balances.freeBalance(authorityId)
          .pipe(first())
          .toPromise()),
      );
      validators.forEach((authorityId, index) => {
        createElement(`Validator: ${authorityId.toString()} <br />Balance: ${validatorBalances[index].toString()}`, wrapper);
      });
    }
  });
};
