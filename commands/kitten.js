import fetch from 'axios';

export default () => ({
  help: 'Get a picture of a kitten with some dimensions',
  example: '640 480',
  fn: args => {
    const range = args.split(' ');
    const x = Number(range[0]);
    const y = Number(range[1]);

    if (Number.isNaN(x) || Number.isNaN(y)) throw new Error('x and y are required');

    return fetch(`http://placekitten.com/${x}/${y}`, {
      method: 'GET',
      responseType: 'stream',
    })
      .then(resp => {
        return {
          type: 'file',
          value: {
            title: 'Kitten',
            file: resp.data,
            filename: 'kitten.jpg',
            type: 'jpg',
            initial_comment: 'Awwww, look at this kitten',
          },
        };
      })
      .catch(() => {
        return 'Aw, no adorable kittens found in those dimensions. Try some nice round numbers k?';
      });
  },
});
