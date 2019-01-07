import { ApiRx } from '@polkadot/api';
import {
  createElement, createWrapper,
} from '../commons';

export default (provider) => {
  const wrapper = createWrapper('01-simple-connect', 'Rx - Simple Connect');
  // Create our API with a connection to the node
  ApiRx.create(provider).subscribe(async (api) => {
    // Use toPromise() with async/await to emit the last Observable value as a Promise
    const [chain, nodeName, nodeVersion, properties] = await Promise.all([
      api.rpc.system.chain().toPromise(),
      api.rpc.system.name().toPromise(),
      api.rpc.system.version().toPromise(),
      api.rpc.system.properties().toPromise(),
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
  });
};
