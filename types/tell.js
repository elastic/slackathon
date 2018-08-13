import { name } from '../config.json';
import postMessageToSlack from '../lib/post_message_to_slack';
import types from './index';

export default () => ({
  fn: (tellInput, message, handlers) => {
    const { to, from, output } = tellInput;

    try {
      const type = types[output.type];
      if (!type) throw new Error(`Unknown type returned from command: ${output.type}`);

      return postMessageToSlack(
        to,
        `Beep boop. I'm a bot and I have a message incoming from <@${from}>. Hold tight.
If you want to know more about me, type \`@${name} help\``
      )
        .then(() => {
          const tellHandlers = { ...handlers, getTo: () => to };
          return type().fn(output.value, message, tellHandlers);
        })
        .catch(e => {
          postMessageToSlack(from, `Tell failed: ${e.error}`);
        })
        .then(() => {
          postMessageToSlack(from, `Check, <@${to}> got the message. They got it real good.`);
        });
    } catch (e) {
      postMessageToSlack(from, `Tell failed: ${e.message}`);
    }
  },
});
