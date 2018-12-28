import { WsProvider } from '@polkadot/rpc-provider';
import './style.css';

import {
  simpleConnect,
  listenToBlocks,
  listenToBalanceChange,
  // createAccount,
  readChainState,
  makeTransfer,
  displaySystemEvents
} from './with-promise-api';
// import { simpleConnect, listenToBlocks } from './api-calls/with-rx-api';

// Initialise the provider to connect to the local node
const provider = new WsProvider('ws://127.0.0.1:9944');
// const provider = new WsProvider('wss://substrate-rpc.parity.io/');

(function main () {
  simpleConnect(provider).catch(console.error);
  listenToBlocks(provider).catch(console.error);
  listenToBalanceChange(provider).catch(console.error);
  // createAccount(provider).catch(console.error),
  readChainState(provider).catch(console.error);
  makeTransfer(provider).catch(console.error);
  displaySystemEvents(provider).catch(console.error);
}());
