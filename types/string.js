import Slackbot from 'slackbots';
import config from '../config.json';

const slackbot = new Slackbot(config);

export default () => {
  fn: (output, message, handlers) => {
    return slackbot.postMessage(handlers.getChannel(message), output, output);
  };
};
