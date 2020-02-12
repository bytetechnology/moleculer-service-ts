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
  const sampleService = broker.createService(sample1);

  beforeAll(async () => {
    await broker.start();
  });

  afterAll(async () => {
    broker.destroyService(sampleService);
    await broker.stop();
  });

  // test actions
  describe('Testing actions', () => {
    it('Action without parameter', async () => {
      const response: string = await broker.call('sample1.hello');
      expect(response).toBe('Hello World!');
    });

    it('Action with required parameter', async () => {
      const response: string = await broker.call('sample1.welcome', {
        name: 'Ujwal'
      });
      expect(response).toBe('Welcome Ujwal!');
    });

    it('Action with optional parameter missing', async () => {
      const response: string = await broker.call('sample1.boo', {
        foo: 'Foo'
      });
      expect(response).toBe('Welcome Foo!');
    });

    it('Action with optional parameter included', async () => {
      const response: string = await broker.call('sample1.boo', {
        foo: 'Foo',
        bar: 'Bar'
      });
      expect(response).toBe('Welcome Foo Bar!');
    });
  });

  // test events
  describe('Testing events', () => {
    beforeAll(() => {
      sampleService.event1TestReturn = jest.fn();
      sampleService.event2TestReturn = jest.fn();
    });
    afterAll(() => {
      sampleService.event1TestReturn.mockRestore();
      sampleService.event2TestReturn.mockRestore();
    });

    it('Event1 without payload', () => {
      sampleService.emitLocalEventHandler(
        'sample1.event1',
        null,
        'sample1'
      );
      expect(sampleService.event1TestReturn).toBeCalledTimes(1);
    });

    it('Event1 with payload', () => {
      sampleService.emitLocalEventHandler(
        'sample1.event1',
        { foo: 'bar' },
        'sample1'
      );
      expect(sampleService.event1TestReturn).toBeCalledTimes(2);
    });

    it('Event2 with good payload', () => {
      sampleService.emitLocalEventHandler(
        'sample1.event2',
        { id: '1234' },
        'sample1'
      );
      expect(sampleService.event2TestReturn).toBeCalledTimes(1);
    });

    it('Event2 with bad payload', () => {
      sampleService.emitLocalEventHandler(
        'sample1.event2',
        { id: 1234 },
        'sample1'
      );
      expect(sampleService.event2TestReturn).toBeCalledTimes(2);
    });
  });
});
