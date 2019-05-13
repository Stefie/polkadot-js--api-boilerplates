import { ApiPromise } from '@polkadot/api';
import {
  createButton, createLog, createError, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/promise/02_listen_to_blocks/
export default async (provider) => {
  const wrapper = createWrapper('listen-to-blocks', 'Promise - Listen to Blocks');
  try {
    // Create our API with a connection to the node
    const api = await ApiPromise.create(provider);
    window.api = api;
    // Subscribe to the new headers on-chain. The callback is fired when new headers
    // are found, the call itself returns a promise with a subscription that can be
    // used to unsubscribe from the newHead subscription
    console.log(api);
    const unsubscribe = await api.rpc.chain.subscribeNewHead((header) => {
      createLog(`Chain is at block: #${header.blockNumber}`, wrapper);
    });

    createButton(unsubscribe, wrapper, 'Unsubscribe');
  } catch (e) {
    createError(e, wrapper);
  }
};
