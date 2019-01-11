import { ApiPromise } from '@polkadot/api';
import {
  createElement, createError, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/promise/01_simple_connect/
export default async (provider) => {
  const wrapper = createWrapper('01-simple-connect', 'Promise - Simple Connect');
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

    createElement(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`, wrapper);
    createElement(`WebSocket URL is ${provider.endpoint}`, wrapper);

    if (properties.size > 0) {
      createElement('Node specific properties: ', wrapper, 'highlight');
      properties.forEach((value, key) => {
        createElement(`&bull; ${key}: ${value}`, wrapper);
      });
    } else {
      createElement('No specific chain properties found.', wrapper, 'highlight');
    }
  } catch (e) {
    createError(e, wrapper);
  }
};
