import { ApiRx } from '@polkadot/api';
import {
  createElement, createWrapper,
} from '../commons';

export default (provider) => {
  const wrapper = createWrapper('02-listen-to-blocks', 'Rx - Listen to Blocks');
  // Create our API with a connection to the node
  ApiRx.create(provider).subscribe((api) => {
    api.rpc.chain.subscribeNewHead().subscribe((header) => {
      createElement(`Chain is at block: #${header.blockNumber}`, wrapper);
    });
  });
};
