import { WsProvider } from '@polkadot/rpc-provider';
import { ApiRx } from '@polkadot/api';

import simpleConnect from './examples/01-simple-connect';
import listenToBlocks from './examples/02-listen-to-blocks';
import listenToBalanceChange from './examples/03-listen-to-balance-change';
import readStorage from './examples/05-read-storage';
import makeTransfer from './examples/06-make-transfer';
import displaySystemEvents from './examples/08-system-events';
import transferEvents from './examples/09-transfer-events';

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
  // Include the examples
  // simpleConnect(provider);
  // listenToBlocks(provider);
  // readStorage(provider);
  // makeTransfer(provider);
  // listenToBalanceChange(provider);
  // displaySystemEvents(provider);
  // transferEvents(provider);

  // Add the api to the window object to make it accessible in the browsers dev tools
  window.api = new ApiRx(provider).isReady;

  console.log(window.api.subscribe((header) => {
    console.log(header);
  }));
}());
