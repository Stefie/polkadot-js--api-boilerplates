import { ApiPromise } from '@polkadot/api';

const app = document.querySelector('#content');

const createElement = (content) => {
  console.log(content);
  const p = document.createElement('p');
  p.innerHTML = content;
  app.appendChild(p);
};

export const simpleConnect = async (provider) => {
  // Retrieve the chain & node information information via rpc calls
  const api = await ApiPromise.create(provider);
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);
  createElement(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
};

export const listenToBlocks = async (provider) => {
  const api = await ApiPromise.create(provider);
  const subscriptionId = await api.rpc.chain.subscribeNewHead((header) => {
    createElement(`Active block: #${header.blockNumber}`);
  });
  createElement(`subsciptionId: ${subscriptionId}`);
};
