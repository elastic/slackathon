import client from '../lib/es_client';

export default () => ({
  help: 'Remove a command that has been stored with `store`',
  example: 'remove myCommand',
  fn: args => {
    const name = args.trim();

    if (!name) throw new Error('name is required');

    return client
      .delete({
        index: '.moostme',
        type: 'doc',
        id: name,
      })
      .then(() => `Ok done, I removed the stored command \`${name}\``)
      .catch(resp => resp.message);
  },
});
