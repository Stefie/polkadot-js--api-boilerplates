import { ApiPromise } from '@polkadot/api';
import {
  createElement, createWrapper,
} from '../commons';

// https://polkadot.js.org/api/examples/promise/02_listen_to_blocks/
export default async (provider) => {
  const wrapper = createWrapper('02-listen-to-blocks');
  const api = await ApiPromise.create(provider);
  const subscriptionId = await api.rpc.chain.subscribeNewHead((header) => {
    createElement(`Chain is at block: #${header.blockNumber}`, wrapper);
  });
  createElement(`SubsciptionId: ${subscriptionId}`, wrapper);
};
