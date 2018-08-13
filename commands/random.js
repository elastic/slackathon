import { random } from 'lodash';

export default () => ({
  help: 'Generate a random number within a range.',
  example: '0 1',
  fn: args => {
    const range = args.split(' ');
    const lower = Number(range[0]);
    const upper = Number(range[1]);

    if (Number.isNaN(lower) || Number.isNaN(upper))
      throw new Error('upper and lower bounds are required');

    return new Promise(resolve => {
      resolve(String(random(lower, upper)));
    });
  },
});
