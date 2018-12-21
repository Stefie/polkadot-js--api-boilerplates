import { WsProvider } from '@polkadot/rpc-provider';
import './style.css';
// import { fromEvent } from 'rxjs';
// import { throttleTime, map, scan } from 'rxjs/operators';
import {
  simpleConnect,
  listenToBlocks,
  readChainState,
  listenToBalanceChange,
  makeTransfer,
  displaySystemEvents
} from './api-calls/with-api-promise';
// import { simpleConnect, listenToBlocks } from './api-calls/with-api-rx';

// Initialise the provider to connect to the local node
// const provider = new WsProvider('ws://127.0.0.1:9944');
const provider = new WsProvider('wss://substrate-rpc.parity.io/');

(function main () {
  simpleConnect(provider).catch(console.error);
  listenToBlocks(provider).catch(console.error);
  listenToBalanceChange(provider).catch(console.error);
  readChainState(provider).catch(console.error);
  makeTransfer(provider).catch(console.error);
  displaySystemEvents(provider).catch(console.error);
}());
