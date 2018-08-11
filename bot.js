import Slackbot from 'slackbots';
import run from './run';
import { uploadToSlack } from './upload_to_slack';
import config from './config.json';

const { name } = config;
// create a bot
const inputBot = new Slackbot(config);

inputBot.getUser(name).then(me => {
  const { id } = me;

  inputBot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    const { text, channel } = data;
    if (!text) return;

    const match = new RegExp(`^<@${id}>`);
    if (!text.match(match)) return;

    const input = text.split(match)[1].trim();

    run(input).then(output => {
      if (typeof output !== 'object') return inputBot.postMessage(channel, output, {});
      return uploadToSlack({
        ...output,
        channels: channel,
      });
    });
  });
});

/*

*/
