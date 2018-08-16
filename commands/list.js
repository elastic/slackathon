import client from '../lib/es_client';

export default () => ({
  help: 'List known stored commands',
  example: '',
  fn: () => {
    return client
      .search({
        index: '.moostme',
        type: 'doc',
        size: 10000,
      })
      .then(resp => {
        const commands = resp.hits.hits.map(hit => `*${hit._source.name}*`).sort();
        return `Here's the stored commands I know about: ${commands.join(', ')}`;
      })
      .catch(resp => resp.message);
  },
});
