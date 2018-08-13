import postMessageToSlack from '../lib/post_message_to_slack';

export default () => ({
  fn: (output, message, handlers) => postMessageToSlack(handlers.getTo(), output),
});
