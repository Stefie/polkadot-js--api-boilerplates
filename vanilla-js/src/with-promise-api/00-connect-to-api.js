import { ApiPromise } from '@polkadot/api';
import {
  createElement, createWrapper,
} from '../commons';

export default async (provider) => {
  const wrapper = createWrapper('00-connect-to-api', 'Rx - Connect to API');

  new ApiPromise(provider).isReady.then((api) => {
    api.rpc.subscribeNewHead((header) => {
      console.log(`Promise :new block #${header.blockNumber.toNumber()}`);
    });
  });
// createElement(`SubsciptionId: ${subscriptionId}`, wrapper);
};
