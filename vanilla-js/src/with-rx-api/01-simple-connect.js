import { ApiRx } from '@polkadot/api';
import { zip } from 'rxjs';
import {
  createLog, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/rx/01_simple_connect/
export default async (provider) => {
  const wrapper = createWrapper('simple-connect', 'Rx - Simple Connect');

  // Create our API with a connection to the node
  const api = await ApiRx.create(provider).toPromise();
  // We're using RxJs 'zip()' combination operator to get the emitted values
  // of multiple observables as an array
  zip(
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
    api.rpc.system.properties()
  ).subscribe(([chain, nodeName, nodeVersion, properties]) => {
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
  });
};
