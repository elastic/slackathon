import client from '../lib/es_client';
import run from '../run';

export default () => ({
  help: 'Run a command that has been stored with `store`',
  example: 'recall mycommand',
  fn: (args, message, handlers) => {
    const name = args.trim();

    if (!name) throw new Error('name is required');

    return client
      .get({
        index: '.moostme',
        type: 'doc',
        id: name,
      })
      .then(doc => {
        return run(doc._source.command, message, handlers);
      })
      .catch(resp => resp.message);
  },
});
