# Slackoff
The Friday-fun-time bot. Born of beer. 

## What is it?
This is the simple slack chat bot that a few of us put together one epic Friday. Unlike other beer fueled ideas, this one actually works pretty well and didn't require a trip to the hospital.

## How do I use it?
It's nodejs, so if you do node, you'll be pretty at home here. You probably want a pretty recent version of node. Might I also suggest `nvm` and `yarn`? To get the ball rolling

Install the dependencies

```
yarn install
```

You'll need to get a slack bot token (https://my.slack.com/services/new/bot). Then create a file called `config.json` in the root of the project and add something like this to it

```
{
  "token": "xoxb-8657309-X0DEADBEEFCAFE-crossfitp90xpaleobaconator",
  "name": "dbcbot"
}
```


Run the thing

```
yarn start
```

With any luck, your bot is now connected to Slack. Good for you! I'd suggest joining the `#test-` channel on the elastic slack and inviting your bot to it by `@mentioning` it. 

Now you can interact with it by `@mentioning`. Try

```
@dbcbot help
```

### Now what?
Well, the bot does some simple stuff, but I bet you have ideas for more! Adding commands is pretty trivial. Drop into the `commands/` directory and take a look around. I'd suggest copying the `random.js` and working off of that. That will teach you how arguments work and  get you simple string replies.

If you want todo more than string replies (you do), then you probably want to return something more complex from your function. If you want to upload files take a look at `kitten.js` for an example. 

Once you've created your function, import it to `index.js` and add it to the object that is exported. Whatever you export it as becomes the command name.

### But I want to use an entirely different API
Now we're talking! Slackoff can do that. See the `types/` directory. Each of these maps to an object type that is returned from a command. See `file.js`. That maps up to the `{type: 'file'}` that is returned from `kitten.js`.

As you can see, `file.js` is the bit that actually does the uploading to slack. 

### Annnnd GO!
That should be everything you need to hack on this. 

### The future
- [] Allow the bot to connect to networks aside from slack. This should be pretty simple, you just need another layer and a bit more config. Commands wouldn't change, but you'd need a `type` handler for each kind of network
- [] Your totally excellent idea here.
