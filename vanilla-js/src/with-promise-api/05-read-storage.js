import { ApiPromise } from '@polkadot/api';
import {
  ALICE, createElement, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/promise/05_read_storage/
export default async (provider) => {
  const wrapper = createWrapper('05-read-storage');
  // Create our API with a default connection to the local node
  const api = await ApiPromise.create(provider);
  // Make our basic chain state/storage queries, all in one go
  const [accountNonce, blockPeriod, validators] = await Promise.all([
    api.query.system.accountNonce(ALICE),
    api.query.timestamp.now(),
    api.query.session.validators()
  ]);
  console.log('validators', validators);
  createElement(`accountNonce(${ALICE}) ${accountNonce}`, wrapper);
  createElement(`blockPeriod ${blockPeriod.toNumber()} seconds`, wrapper);

  // @TODO
  if (validators.length > 0) {
    // Retrieve the balances for all validators
    const validatorBalances = await Promise.all(
      validators.map((accountId) => {
        console.log('accountId', accountId);
        // @TODO Qeustion: The next line returns an array with three numbers. Is that a) correct? (the type comes down to AnyNumber https://github.com/polkadot-js/api/blob/master/packages/types/src/types.ts#L7) and b) what do they stand for?
        return api.query.balances.freeBalance(accountId);
      })
      // api.query.balances.freeBalance(authorityId))
      // validators.map(authorityId => api.query.balances.freeBalance(authorityId))
    );
    console.log('YOYOYOY LENGTH!!!!', validatorBalances);
    // const string = validators.map((authorityId, index) => ({
    //   address: authorityId.toString(),
    //   balance: validatorBalances[index].toString()
    // }));
    // createElement('validators', validators.map((authorityId, index) => ({
    //   address: authorityId.toString(),
    //   balance: validatorBalances[index].toString()
    // })), wrapper);
  }
};
