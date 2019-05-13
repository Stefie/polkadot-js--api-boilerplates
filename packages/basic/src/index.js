import { WsProvider } from '@polkadot/rpc-provider';
import { ApiPromise } from '@polkadot/api';
import { ApiRx } from '@polkadot/api';

import { first } from 'rxjs/operators';

import {
  createError, createWrapper
} from './commons';

const provider = new WsProvider('ws://127.0.0.1:9944');
// const provider = new WsProvider('wss://poc3-rpc.polkadot.io/');
// const provider = new WsProvider('wss://substrate-rpc.parity.io/');

const ID = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const IX = 'F7Hs';
const accountIds = ['5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'];

(async function main () {
  const wrapper = createWrapper('simple-connect', 'Test derive methods?');

  try {
    // Create our API with a connection to the node
    const api = await ApiPromise.create(provider);
    console.log('api', api);

    // api.query.session.validators((controllers) => {
    //   console.log('session', controllers);
    // });

    // api.query.staking.validators((controllers) => {
    //   console.log('staking', controllers);
    // });

    api.derive.chain.getHeader('0x9bbb03430b3d4e324f481aa192738a7ba650b08d5e9676f93813e15e16abb67e', (result) => {
      console.log('RESULT', result)
    });

    // const deriveTest = await api.derive.accounts.idAndIndex('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
    // const [subscribeNewHead] = await Promise.all([
    //   api.derive.chain.subscribeNewHead()
    // ]);

  } catch (e) {
    createError(e, wrapper);
  }
}());
