import { ApiRx } from '@polkadot/api';
import {
  createElement, createWrapper
} from '../commons';

export default (provider) => {
  const wrapper = createWrapper('07-display-system-events', 'Rx - Display System Events');
  // Instanciate API
  ApiRx.create(provider).subscribe((api) => {
  // subscribe to system events via storage
    api.query.system.events().subscribe((events) => {
      createElement(`----- Received ${events.length} event(s): -----`, wrapper, 'highlight');
      // loop through the Vec<EventRecord>
      events.forEach((record) => {
      // extract the phase, event and the event types
        const { event, phase } = record;
        const types = event.typeDef;
        // show what we are busy with
        createElement(`${event.section}:${event.method}:: (phase=${phase.toString()})`, wrapper);
        createElement(`\t${event.meta.documentation.toString()}`, wrapper);
        // loop through each of the parameters, displaying the type and data
        event.data.forEach((data, index) => {
          createElement(`\t\tt${types[index].type}: ${data.toString()}`, wrapper);
        });
      });
      createElement(`----- End ${events.length} event(s): -----------`, wrapper, 'console');
    });
  });
};
