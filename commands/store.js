import client from '../lib/es_client';
import config from '../config.json';

export default () => ({
  help: 'Remember a command with a given name, and recall it with the `recall` command',
  example: 'store real-cute kitten 640 480',
  fn: (args, message) => {
    const parts = args.split(' ');
    const name = parts.shift();
    const command = parts.join(' ');

    if (!name || !command) throw new Error('Name and command are required');

    const doc = {
      name,
      command,
      owner: message.user,
      '@timestamp': new Date().toISOString(),
    };

    return client
      .create({
        index: '.moostme',
        type: 'doc',
        id: name,
        body: doc,
      })
      .then(
        () =>
          `Check. I'll remember that. You can get it back with \`@${config.name} recall ${name}\``
      )
      .catch(err => {
        if (err.status === 409)
          return `Oops, \`${name}\` already exists. Remove it with \`@${
            config.name
          } remove ${name}\``;
        return err.error.reason;
      });
  },
});
