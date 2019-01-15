import { WsProvider } from '@polkadot/rpc-provider';

import {
  simpleConnect,
  // listenToBlocks,
  readChainState,
  // makeTransfer,
  listenToBalanceChange
  // displaySystemEvents
  // transferEvents
} from './with-promise-api';
import {
  // simpleConnect,
  listenToBlocks,
  // readChainState,
  makeTransfer,
  // listenToBalanceChange,
  // displaySystemEvents,
  transferEvents
} from './with-rx-api';

// Choose which provider you want to connect to:
/**
** Local Node (Substrate, 127.0.0.1:9944)
**/
const provider = new WsProvider('ws://127.0.0.1:9944');

/**
** Node Charred Cherry (Substrate, hosted by Parity Technologies)
**/
// const provider = new WsProvider('wss://substrate-rpc.parity.io/');

(function main () {
  simpleConnect(provider);
  listenToBlocks(provider);
  readChainState(provider);
  makeTransfer(provider);
  listenToBalanceChange(provider);
  // displaySystemEvents(provider);
  transferEvents(provider);
}());
