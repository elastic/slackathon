import { resolve } from 'path';
import { createReadStream } from 'fs';

export default () => ({
  help: 'Tell me who wrote this bot',
  example: '',
  fn: () => {
    return {
      title: 'Idiots.',
      file: createReadStream(resolve(__dirname, 'idiots.jpg')),
      filename: 'idiots.jpg',
      type: 'jpg',
      initial_comment: 'These idiots stayed up half the night pounding keyboards, and beer.',
    };
  },
});
