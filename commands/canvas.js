import fetch from 'axios';
import rison from 'rison-node';

export default () => ({
  help: 'Run a canvas expression and get an image back',
  example: 'demodata | render',
  fn: args => {
    //(browserTimezone:America%2FPhoenix,layout:(dimensions:(height:720,width:1080),id:preserve_layout),objectType:'canvas%20workpad',relativeUrls:!(${reportURL}),title:'STUFF')

    // http://localhost:5601/api/reporting/generate/printablePdf?jobParams=(browserTimezone:America/Phoenix,layout:(dimensions:(height:720,width:1080),id:preserve_layout),objectType:'canvas workpad',relativeUrls:!('http://localhost:5601/dtw/app/canvas#/execute/expression?exp=demodata | render'))

    const reportURL = `/app/canvas#/execute/expression?exp=${args.trim()}`;

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
    console.log(encoded);

    const URL2 = `http://localhost:5601/api/reporting/generate/printablePdf?jobParams=${encodeURIComponent(
      encoded
    )}`;

    console.log(URL2);
    return new Promise(resolve => {
      fetch(URL2, {
        method: 'POST',
        headers: { 'kbn-xsrf': 'Well this was easy' },
      })
        .then(resp => {
          const { path } = resp.data;
          const fullPath = `http://localhost:5601${path}`;
          console.log('FULLPATH', fullPath);
          let timeout = 20;

          function poll() {
            timeout--;
            setTimeout(() => {
              fetch(fullPath, { responseType: 'stream' })
                .then(resp => {
                  resolve({
                    title: 'Canvas Element',
                    file: resp.data,
                    filename: 'canvas.png',
                    type: 'png',
                    initial_comment: `Output of \`${args.trim()}\``,
                  });
                })
                .catch(() => {
                  if (!timeout)
                    throw new Error(
                      'Expression timed out. Well, probably totally failed, but who knows. Sorry. Write better code next time dingus.'
                    );
                  console.log('TRYING....');
                  poll();
                });
            }, 1000);
          }

          poll();
        })
        .catch(e => {
          resolve(`OOPS: ${e}`);
        });
    });
  },
});
