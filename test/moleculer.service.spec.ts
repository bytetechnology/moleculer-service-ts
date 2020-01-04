import { TypedServiceBroker } from '../src/index'; // eslint-disable-line import/extensions
import {
  ServiceAction as Sample1Action,
  ServiceEvent as Sample1Event,
  ServiceName as Sample1Name
} from './services/sample1.service.types'; // eslint-disable-line import/extensions
import sample1 from './services/sample1.service'; // eslint-disable-line import/extensions

type ServiceAction = Sample1Action;
type ServiceEvent = Sample1Event;
type ServiceName = Sample1Name;

describe('moleculer-service-ts', () => {
  const broker: TypedServiceBroker<
    ServiceAction,
    ServiceEvent,
    ServiceName
  > = new TypedServiceBroker<
    ServiceAction,
    ServiceEvent,
    ServiceName
  >({ logLevel: 'info' });

  beforeAll(async () => {
    broker.createService(sample1);
    await broker.start();
  });

  afterAll(async () => {
    broker.destroyService(sample1);
    await broker.stop();
  });

  it('Action without parameter', async () => {
    // emit an event as well so that that can get tested. no return on event
    broker.emit('sample1.event1', undefined, 'sample1');
    const response: string = await broker.call('sample1.hello');
    expect(response).toBe('Hello World!');
  });

  it('Action with required parameter', async () => {
    // emit an event as well so that that can get tested. no return on event
    broker.emit('sample1.event2', { id: '1234' });
    const response: string = await broker.call('sample1.welcome', {
      name: 'Ujwal'
    });
    expect(response).toBe('Welcome Ujwal!');
  });

  it('Action with optional parameter missing', async () => {
    // emit an event as well so that that can get tested. no return on event
    broker.emit('sample1.event1', undefined, 'sample1');
    const response: string = await broker.call('sample1.boo', {
      foo: 'Foo'
    });
    expect(response).toBe('Welcome Foo!');
  });

  it('Action with optional parameter included', async () => {
    // emit an event as well so that that can get tested. no return on event
    broker.emit('sample1.event2', { id: '5678' }, 'sample1');
    const response: string = await broker.call('sample1.boo', {
      foo: 'Foo',
      bar: 'Bar'
    });
    expect(response).toBe('Welcome Foo Bar!');
  });
});
