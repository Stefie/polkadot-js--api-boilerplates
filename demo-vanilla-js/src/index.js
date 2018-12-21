import { WsProvider } from '@polkadot/rpc-provider';
import { ApiPromise } from '@polkadot/api';
import './style.css';

const app = document.querySelector('#content');
const provider = new WsProvider('wss://substrate-rpc.parity.io/');
// If you're running a local node, use this line instead of the one above ^^.
// const provider = new WsProvider('ws://127.0.0.1:9944');

const createElement = (content) => {
  console.log(content);
  const p = document.createElement('p');
  p.innerHTML = content;
  app.appendChild(p);
};

const simpleConnect = async (ws) => {
  // Retrieve the chain & node information information via rpc calls
  const api = await ApiPromise.create(ws);
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);
  createElement(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
};

const listenToBlocks = async (ws) => {
  const api = await ApiPromise.create(provider);
  const subscriptionId = await api.rpc.chain.subscribeNewHead((header) => {
    createElement(`Chain is at: #${header.blockNumber}`);
  });
  createElement(`subsciptionId: ${subscriptionId}`);
};

async function main () {
  simpleConnect(provider);
  listenToBlocks(provider);
}

main().catch(console.error);
