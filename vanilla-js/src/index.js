import { WsProvider } from '@polkadot/rpc-provider';
import './style.css';

import {
  // simpleConnect,
  listenToBlocks,
  // listenToBalanceChange,
  readChainState,
  // makeTransfer,
  displaySystemEvents,
} from './with-promise-api';
import {
  simpleConnect, // @TODO debug subscriptionId
  // listenToBlocks,
  listenToBalanceChange,
  // readChainState, // @TODO debug 'nonce === null vs. 0' in ApiRx or rpc-rx
  makeTransfer, // @TODO go through examples in docs
  // displaySystemEvents,
} from './with-rx-api';

// Initialise the provider to connect to the local node
const provider = new WsProvider('ws://127.0.0.1:9944');
// const provider = new WsProvider('wss://substrate-rpc.parity.io/');

(function main() {
  simpleConnect(provider);
  listenToBlocks(provider);
  listenToBalanceChange(provider);
  readChainState(provider);
  makeTransfer(provider);
  displaySystemEvents(provider);
}());
