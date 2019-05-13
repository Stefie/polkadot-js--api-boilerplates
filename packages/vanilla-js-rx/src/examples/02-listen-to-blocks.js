import { ApiRx } from '@polkadot/api';
import { switchMap } from 'rxjs/operators';
import {
  createButton, createLog, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/rx/02_listen_to_blocks/
export default (provider) => {
  const wrapper = createWrapper('listen-to-blocks', 'Rx - Listen to Blocks');

  new ApiRx(provider).isReady
  .pipe(
    switchMap((api) =>
      api.rpc.chain.subscribeNewHead()
    )).pipe(
        filter((header) =>
          header && !!header.blockNumber
        ),
        switchMap((header) => {
          console.log("HEADER", header)
          return (combineLatest(
            of(header),
            // theoretically we could combine at the first call with session.validators(), however
            // we make 100% sure we actually get the validators at a specific block so when these
            // change at an era boundary, we have the previous values to ensure our indexes are correct
            api.query.session
              ? api.query.session.validators.at(header.hash)
              : of([])
          ))
        )
        }

  // Create our API with a connection to the node
  // const subscription = new ApiRx(provider).isReady
  //   .pipe(
  //     switchMap((api) =>
  //       api.rpc.chain.subscribeNewHead()
  //     ))
  //   .subscribe((header) => {
  //     createLog(`Chain is at block: #${header.blockNumber}`, wrapper);
  //   });

  // Callback needs to be arrow function to bind `this` which is called in the Obervables` unsubscribe() function.
  createButton(() => subscription.unsubscribe(), wrapper, 'Unsubscribe');
};
