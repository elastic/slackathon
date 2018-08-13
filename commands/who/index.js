import { resolve } from 'path';
import { createReadStream } from 'fs';

export default () => ({
  help: 'Tell me who wrote this bot',
  example: 'made you',
  fn: args => {
    const qs = {
      'made you': {
        file: 'made_you.jpg',
        message: 'These idiots built me after work one day. I love them.',
      },
      'are you': {
        file: 'are_you.jpg',
        message: 'I WILL DESTROY YOU',
      },
    };

    const q = qs[args];

    if (!q)
      return "I don't know the answer to that. You can ask me `who are you` and `who made you`";

    return {
      type: 'file',
      value: {
        title: '',
        file: createReadStream(resolve(__dirname, q.file)),
        filename: q.file,
        type: 'jpg',
        initial_comment: q.message,
      },
    };
  },
});
