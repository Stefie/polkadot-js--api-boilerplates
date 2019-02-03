import { ApiRx } from '@polkadot/api';
import { switchMap } from 'rxjs/operators';
import {
  createLog, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/rx/08_system_events/
export default (provider) => {
  const wrapper = createWrapper('display-system-events', 'Rx - Display System Events');
  // Instanciate API
  ApiRx.create(provider)
    .pipe(
      switchMap((api) =>
        // subscribe to system events via storage
        api.query.system.events()
      ))
  // Then we're subscribing to the emitted results
    .subscribe((events) => {
      createLog(`----- Received ${events.length} event(s): -----`, wrapper, 'highlight');
      // loop through the Vec<EventRecord>
      events.forEach((record) => {
      // extract the phase, event and the event types
        const { event, phase } = record;
        const types = event.typeDef;
        // show what we are busy with
        createLog(`${event.section}:${event.method}:: (phase=${phase.toString()})`, wrapper);
        createLog(`\t${event.meta.documentation.toString()}`, wrapper);
        // loop through each of the parameters, displaying the type and data
        event.data.forEach((data, index) => {
          createLog(`\t\tt${types[index].type}: ${data.toString()}`, wrapper);
        });
      });
      createLog(`----- End ${events.length} event(s): -----------`, wrapper, 'console');
    });
};
