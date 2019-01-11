import { ApiRx } from '@polkadot/api';
import {
  createButton, createElement, createWrapper
} from '../commons';

export default (provider) => {
  const wrapper = createWrapper('02-listen-to-blocks', 'Rx - Listen to Blocks');
  // Create our API with a connection to the node
  ApiRx.create(provider).subscribe((api) => {
    const subscription = api.rpc.chain.subscribeNewHead().subscribe((header) => {
      createElement(`Chain is at block: #${header.blockNumber}`, wrapper);
    });
    // Callback needs to be arrow function to bind `this` which is called in the Obervables` unsubscribe() function.
    createButton(() => subscription.unsubscribe(), wrapper, 'Unsubscribe');
  });
};
