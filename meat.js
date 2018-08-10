import commands from './commands';

const str = 'random 10 20';
const commandNames = Object.keys(commands);
const myCommandsAre = `I support the following commands, address me with one of them to find out more: ${commandNames.join(
  ', '
)}`;

const parts = str.trim().split(' '); // Split by space
const commandName = parts.shift();
const commandArgument = parts.join(' ').trim();

// No command found
if (commandName === '') {
  throw new Error(`Hey! Bozo! I'm not a mind reader. What do you want? ${myCommandsAre}`);
}

const command = commands[commandName];

// Invalid command
if (!command) {
  throw new Error(
    `What? I have no idea what "${commandName}" is. You're not making any sense. ${myCommandsAre}`
  );
}

// Valid command
Promise.resolve(command().fn(commandArgument)).then(console.log);
