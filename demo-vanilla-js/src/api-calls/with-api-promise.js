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
  const [chain, nodeName, nodeVersion, properties] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
    api.rpc.system.properties()
  ]);
  createElement(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
  console.log(properties);
};

export const listenToBlocks = async (provider) => {
  const api = await ApiPromise.create(provider);
  const subscriptionId = await api.rpc.chain.subscribeNewHead((header) => {
    createElement(`Chain is at: #${header.blockNumber}`);
  });
  createElement(`subsciptionId: ${subscriptionId}`);
};
