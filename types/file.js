import { uploadToSlack } from '../lib/upload_to_slack';

export default () => {
  fn: (output, message, handlers) => {
    return uploadToSlack({
      ...output,
      channels: handlers.getChannel(message),
    });
  };
};
