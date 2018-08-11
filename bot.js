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
    const { text, channel, user } = data;
    if (!text) return;

    const match = new RegExp(`^<@${id}>`);
    if (!text.match(match)) return;

    const input = text.split(match)[1].trim();

    run(input).then(output => {
      if (typeof output !== 'object') return inputBot.postMessage(channel, output, {});

      if (output.file != null) {
        const timeout1 = setTimeout(() => {
          inputBot.postEphemeral(channel, user, 'Ok, working on it. Give me a few moments here');
        }, 1000);

        const timeout2 = setTimeout(() => {
          inputBot.postEphemeral(
            channel,
            user,
            'This is taking awhile, sorry about that. Workin real hard over here. Sometimes images take awhile'
          );
        }, 5000);

        return uploadToSlack({
          ...output,
          channels: channel,
        }).then(() => {
          clearTimeout(timeout1);
          clearTimeout(timeout2);
        });
      }

      inputBot.postMessage(channel, output.message, output.params);
    });
  });
});

/*

*/
