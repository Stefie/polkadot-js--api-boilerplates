import { WsProvider } from '@polkadot/rpc-provider';
import { simpleConnect, listenToBlocks } from './api-calls/with-api-promise';
import './style.css';

async function main () {
  // Initialise the provider to connect to the local node
  const provider = new WsProvider('ws://127.0.0.1:9944');
  // const provider = new WsProvider('wss://substrate-rpc.parity.io/');
  simpleConnect(provider);
  listenToBlocks(provider);
}

main().catch(console.error);
