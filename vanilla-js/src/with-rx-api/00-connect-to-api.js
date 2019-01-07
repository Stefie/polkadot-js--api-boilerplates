import { ApiRx } from '@polkadot/api';

export default async (provider) => {
  // Subscribe to chain state
  new ApiRx(provider).isReady.subscribe((api) => {
    console.log('new ApiRx(provider).isReady.subscribe', api);
  });

  // Subscribe to chain state
  ApiRx.create(provider).subscribe(async (api) => {
    console.log('ApiRx.create(provider).subscribe', api);
    const [chain, nodeName, nodeVersion, properties] = await Promise.all([
      api.rpc.system.chain().toPromise(),
      api.rpc.system.name().toPromise(),
      api.rpc.system.version().toPromise(),
      api.rpc.system.properties().toPromise(),
    ]);
    console.log(chain, nodeName, nodeVersion, properties);
  });

  // Subscribe to chain state
  const api = new ApiRx(provider).isReady.toPromise();
  console.log('new ApiRx(provider).isReady.toPromise()', api);
  // Get last value
  const apiToPromise = await ApiRx.create(provider).toPromise();
  console.log('await ApiRx.create(provider).toPromise(', apiToPromise);
};
