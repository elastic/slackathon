import Slackbot from 'slackbots';
import run from './run';
import config from './config.json';
import types from './types';
import postMessageToSlack from './lib/post_message_to_slack';

const { name } = config;
// create a bot
const inputBot = new Slackbot(config);

inputBot.on('open', () => {
  console.log(`${name} reporting for duty`);
});

inputBot.on('close', () => {
  console.log(`${name} disconected :(`);
});

inputBot.getUser(name).then(me => {
  const { id } = me;

  inputBot.on('message', function(message) {
    // all ingoing events https://api.slack.com/rtm
    const { text, user, channel } = message;
    if (!text) return;

    const match = new RegExp(`^<@${id}>`);
    if (!text.match(match)) return;

    const handlers = {
      getTo: () => channel,
    };

    const input = text.split(match)[1].trim();

    const timeout1 = setTimeout(() => {
      inputBot.postEphemeral(channel, user, 'Ok, working on it. Give me a few moments here');
    }, 2000);

    const timeout2 = setTimeout(() => {
      inputBot.postEphemeral(
        channel,
        user,
        'This is taking awhile, sorry about that. Workin real hard over here. Sometimes images take awhile'
      );
    }, 8000);

    const done = () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };

    try {
      run(input, message, handlers).then(output => {
        const type = types[output.type];
        if (!type) throw new Error(`Unknown type returned from command: ${output.type}`);

        return Promise.resolve(type().fn(output.value, message, handlers))
          .then(done)
          .catch(e => {
            done();
            postMessageToSlack(channel, e.message);
          });
      });
    } catch (e) {
      // Command failed. Real smooth bud.
      done();
      postMessageToSlack(channel, e.message);
    }
  });
});

/*

*/
