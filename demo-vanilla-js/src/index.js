import { WsProvider } from '@polkadot/rpc-provider';
import { simpleConnect, listenToBlocks } from './api-calls/with-api-promise';
// import { simpleConnect, listenToBlocks } from './api-calls/with-api-rx';
import './style.css';

// Initialise the provider to connect to the local node
// const provider = new WsProvider('ws://127.0.0.1:9944');
const provider = new WsProvider('wss://substrate-rpc.parity.io/');

async function main () {
  // simpleConnect(provider);
  listenToBlocks(provider);
}

main().catch(console.error);
