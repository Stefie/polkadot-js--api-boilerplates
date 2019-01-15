import { ApiRx } from '@polkadot/api';
import {
  createLog, createWrapper
} from '../commons';

export default async (provider) => {
  const wrapper = createWrapper('simple-connect', 'Rx - Simple Connect');
  // Create our API with a connection to the node
  ApiRx.create(provider).subscribe(async (api) => {
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
  });
};
