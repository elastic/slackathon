import run from '../run';

export default () => ({
  help: 'Tell another slack user about the requests of a request',
  example: '@w33ble whomadeyou',
  fn: (args, message, handlers) => {
    const recepient = args.split(/\s+/)[0];
    const parts = args.split(new RegExp(recepient));
    const command = parts[1];

    if (!recepient || recepient === '' || !command || command === '')
      return '`tell` requires a recepient and a command';

    return run(command, message, handlers).then(output => {
      return {
        type: 'tell',
        value: {
          from: message.user,
          to: recepient.replace(/<@(.*)>/, '$1'),
          output: output,
        },
      };
    });
  },
});
