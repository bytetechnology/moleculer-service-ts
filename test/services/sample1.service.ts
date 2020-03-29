// Moleculer micro-services framework
import moleculer, { Errors } from 'moleculer';
import { Action, Event, Method, Service } from 'moleculer-decorators';

const eventSchema = { id: 'string' };

// Define our service
@Service({
  // Our service name
  name: 'sample1'
})
class Sample1 extends moleculer.Service {
  // Our actions
  @Action()
  hello(ctx: moleculer.Context) {
    this.logger.info(
      `hello got called from ${ctx.nodeID}; caller: ${ctx.caller}`
    );
    return `Hello World ${ctx.caller}!`;
  }

  @Action({
    cache: false,
    params: {
      name: 'string'
    }
  })
  welcome(ctx: moleculer.Context<{ name: string }>) {
    this.logger.info(`welcome got called from ${ctx.nodeID}`);
    return `Welcome ${ctx.params.name}!`;
  }

  @Action({
    cache: false,
    params: {
      foo: 'string',
      bar: {
        type: 'string',
        optional: true
      }
    }
  })
  boo(ctx: moleculer.Context<{ foo: string; bar?: string }>) {
    this.logger.info(`boo got called from ${ctx.nodeID}`);
    if (ctx.params.bar)
      return `Welcome ${ctx.params.foo} ${ctx.params.bar}!`;
    return `Welcome ${ctx.params.foo}!`;
  }

  /* istanbul ignore next */
  @Method
  event1TestReturn() {} // eslint-disable-line class-methods-use-this

  @Event() 'sample1.event1'(
    payload: never,
    sender: string,
    eventName: string
  ) {
    if (payload) {
      this.logger.error(
        `Validation check failed! event ${eventName} does not take any payload!`
      );
      throw new Errors.ValidationError(
        'Event parameter check failed',
        'ERR_VALIDATION',
        payload
      );
    }

    this.logger.info(`Got event ${eventName} from sender ${sender}`);
    this.event1TestReturn();
  }

  /* istanbul ignore next */
  @Method
  event2TestReturn() {} // eslint-disable-line class-methods-use-this

  @Event({
    params: {
      id: 'string'
    }
  })
  'sample1.event2'(
    payload: typeof eventSchema,
    sender: string,
    eventName: string
  ) {
    this.logger.info(
      `Got event ${eventName} from sender ${sender}; id: ${payload.id}`
    );
    this.event2TestReturn();
  }
}

export default Sample1;
