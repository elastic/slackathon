import { resolve } from 'path';
import { createReadStream } from 'fs';

export default () => ({
  help: 'Tell me who wrote this bot',
  example: '',
  fn: () => {
    return {
      title: 'These idiots.',
      file: createReadStream(resolve(__dirname, 'idiots.jpg')),
      filename: 'idiots.jpg',
      type: 'jpg',
    };
  },
});
