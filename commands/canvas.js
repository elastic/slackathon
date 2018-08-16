import fetch from 'axios';
import rison from 'rison-node';

export default () => ({
  help: 'Run a canvas expression and get an image back',
  example: 'demodata | render',
  fn: args => {
    args = args.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

    const reportURL = `/app/canvas#/execute/expression?exp=${encodeURIComponent(args.trim())}`;

    const config = {
      browserTimezone: 'America/Phoenix',
      layout: {
        dimensions: {
          width: 640,
          height: 480,
        },
        id: 'preserve_layout',
      },
      objectType: 'canvas workpad',
      relativeUrls: [reportURL],
      title: 'Foo',
    };

    const encoded = rison.encode(config);

    const URL2 = `http://localhost:5601/api/reporting/generate/printablePdf?jobParams=${encodeURIComponent(
      encoded
    )}`;

    return new Promise(resolve => {
      fetch(URL2, {
        method: 'POST',
        headers: { 'kbn-xsrf': 'Well this was easy' },
      })
        .then(resp => {
          const { path } = resp.data;
          const fullPath = `http://localhost:5601${path}`;
          let timeout = 20;

          function poll() {
            timeout--;
            setTimeout(() => {
              fetch(fullPath, { responseType: 'stream' })
                .then(resp => {
                  resolve({
                    type: 'file',
                    value: {
                      title: 'Canvas Element',
                      file: resp.data,
                      filename: 'canvas.png',
                      type: 'png',
                      initial_comment: `Output of:           
\`\`\`
${args.trim()}
\`\`\``,
                    },
                  });
                })
                .catch(() => {
                  if (!timeout) {
                    resolve(
                      'Expression timed out. Well, probably totally failed, but who knows. Sorry. Write better code next time dingus.'
                    );
                    return;
                  }

                  console.log('WAITING FOR REPORT....');
                  poll();
                });
            }, 2000);
          }

          poll();
        })
        .catch(e => {
          resolve(`OOPS: ${e}`);
        });
    });
  },
});
