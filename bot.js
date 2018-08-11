import Slackbot from 'slackbots';
import run from './run';
import { uploadToSlack } from './lib/upload_to_slack';
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

    const done = () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };

    try {
      run(input, data).then(output => {
        // We know it's an object. Is it uploading a file? If so, use a slack api that supports that
        if (output.file != null) {
          return uploadToSlack({
            ...output,
            channels: channel,
          }).then(done);
        }

        // No file? Then you probably want your function to return an object in this shape if you're sending
        // anything but a simple shape:
        /*
          {
            message: 'some string here',
            params: {... valid slack API params object. Good for attachments that aren't images. Eg, code}
          }
        */

        inputBot.postMessage(channel, output.message, output.params);
        done();
      });
    } catch (e) {
      inputBot.postMessage(channel, e.message);
      done();
    }
  });
});

/*

*/
