import { ApiRx } from '@polkadot/api';
import {
  createLog, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/rx/01_simple_connect/
export default async (provider) => {
  const wrapper = createWrapper('simple-connect', 'Rx - Simple Connect');

  // Create our API with a connection to the node
  const api = await ApiRx.create(provider).toPromise();
  // Use toPromise() with async/await to emit the last Observable value as a Promise
  const [chain, nodeName, nodeVersion, properties] = await Promise.all([
    api.rpc.system.chain().toPromise(),
    api.rpc.system.name().toPromise(),
    api.rpc.system.version().toPromise(),
    api.rpc.system.properties().toPromise()
  ]);

  createLog(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`, wrapper);
  createLog(`WebSocket URL is ${provider.endpoint}`, wrapper);

  if (properties.size > 0) {
    createLog('Node specific properties: ', wrapper, 'highlight');
    properties.forEach((value, key) => {
      createLog(`&bull; ${key}: ${value}`, wrapper);
    });
  } else {
    createLog('No node specific properties found.', wrapper, 'highlight');
  }
};
