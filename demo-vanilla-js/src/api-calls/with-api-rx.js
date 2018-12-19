import { ApiRx } from '@polkadot/api';

const app = document.querySelector('#content');

const createElement = (content) => {
  console.log(content);
  const p = document.createElement('p');
  p.innerHTML = content;
  app.appendChild(p);
};

export const listenToBlocks = async (provider) => {
  const api = await ApiRx.create(provider).toPromise();
  const subscriptionId = api.rpc.chain.subscribeNewHead().subscribe((header) => {
    createElement(`Chain is at #${header.blockNumber}`);
  });
  console.log('subscriptionId', subscriptionId);
};
