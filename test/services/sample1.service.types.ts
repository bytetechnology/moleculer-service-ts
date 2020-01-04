import {
  GenericActionWithParameters,
  GenericActionWithoutParameters,
  GenericEventWithoutPayload,
  GenericEventWithPayload
} from '../../src/index'; // eslint-disable-line import/extensions

export type ServiceName = 'sample1';

export type ServiceAction =
  | GenericActionWithoutParameters<'sample1.hello', string>
  | GenericActionWithParameters<
      'sample1.boo',
      { foo: string; bar?: string },
      string
    >
  | GenericActionWithParameters<
      'sample1.welcome',
      { name: string },
      string
    >;

export type ServiceEvent =
  | GenericEventWithoutPayload<'sample1.event1'>
  | GenericEventWithPayload<'sample1.event2', { id: string }>;
