import { ApiPromise } from '@polkadot/api';
import {
  createLog, createError, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/promise/01_simple_connect/
export default async (provider) => {
  const wrapper = createWrapper('simple-connect', 'Promise - Simple Connect');
  // Retrieve the chain & node information information via rpc calls
  try {
    // Create our API with a connection to the node
    const api = await ApiPromise.create(provider);
    const [chain, nodeName, nodeVersion, properties] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
      api.rpc.system.properties()
    ]);

    createLog(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`, wrapper);
    createLog(`WebSocket URL is ${provider.endpoint}`, wrapper);

    if (properties.size > 0) {
      createLog('Node specific properties: ', wrapper, 'highlight');
      properties.forEach((value, key) => {
        createLog(`&bull; ${key}: ${value}`, wrapper);
      });
    } else {
      createLog('No specific chain properties found.', wrapper, 'highlight');
    }
  } catch (e) {
    createError(e, wrapper);
  }
};
