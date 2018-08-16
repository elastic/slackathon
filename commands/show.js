import client from '../lib/es_client';

export default () => ({
  help: 'Show the text of a stored command',
  example: 'show mycommand',
  fn: args => {
    const name = args.trim();

    if (!name) throw new Error('name is required');

    return client
      .get({
        index: '.moostme',
        type: 'doc',
        id: name,
      })
      .then(doc => {
        return `Here's what I found for \`${name}\`: 

\`\`\`
${doc._source.command}
\`\`\``;
      })
      .catch(resp => resp.message);
  },
});
