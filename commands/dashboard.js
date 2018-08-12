import fetch from 'axios';
import rison from 'rison-node';

export default () => ({
  help: 'Get a snapshot of a dashboard back',
  example: 'dashboard 75f99551-ce8e-4f28-a97d-42c932b4b35a',
  fn: args => {
    args = args.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

    const dashboardID = args.split(' ')[0];
    const dashboardURL = `/app/kibana#/dashboard/${dashboardID}`;

    const config = {
      browserTimezone: 'America/Phoenix',
      layout: {
        dimensions: {
          width: 960,
          height: 720,
        },
        id: 'preserve_layout',
      },
      objectType: 'canvas workpad',
      relativeUrls: [dashboardURL],
      title: 'Foo',
    };

    const encoded = rison.encode(config);

    const URL2 = `http://localhost:5601/api/reporting/generate/printablePdf?jobParams=${encodeURIComponent(
      encoded
    )}`;

    return new Promise(resolve => {
      fetch(URL2, {
        method: 'POST',
        headers: { 'kbn-xsrf': 'Michael Gerard Tyson' },
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
                    title: 'Kibana Dashboard',
                    file: resp.data,
                    filename: 'dashboard.png',
                    type: 'png',
                    initial_comment: `Output of \`${args.trim()}\``,
                  });
                })
                .catch(() => {
                  if (!timeout)
                    throw new Error(
                      'Expression timed out. Well, probably totally failed, but who knows. Sorry. Write better code next time dingus.'
                    );
                  poll();
                });
            }, 1000);
          }

          poll();
        })
        .catch(e => {
          console.error(e);
          resolve(`OOPS: ${e}`);
        });
    });
  },
});
