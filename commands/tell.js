import run from '../run';

export default () => ({
  help: 'Tell another slack user about the requests of a request',
  example: '@w33ble whomadeyou',
  fn: (args, message) => {
    const recepient = args.split(/\s+/)[0];
    const parts = args.split(new RegExp(recepient));
    const command = parts[1];

    if (!recepient || recepient === '' || !command || command === '')
      return '`tell` requires a receipient and a command';

    return run(command).then(output => {
      if (output.file) {
        return {
          ...output,
          initial_comment: `${recepient}, <@${message.user}> wanted you to know: ${output.initial_comment}`,
        };
      }
      return {
        ...output,
        message: `${recepient}, <@${message.user}> wanted you to know: ${output.message}`,
      };
    });
  },
});
