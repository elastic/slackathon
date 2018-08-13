import commands from './commands';
import { name } from './config.json';
import normalizeOutput from './lib/normalize_output';

export default (str, data, handlers) => {
  const parts = str.trim().split(' '); // Split by space
  const commandName = parts.shift();
  const commandArgument = parts.join(' ').trim();

  // No command found
  if (commandName === '') {
    throw new Error(`Hey! Bozo! I'm not a mind reader. What do you want? Try: \`@${name} help\``);
  }

  const command = commands[commandName];

  // Invalid command
  if (!command) {
    throw new Error(
      `What? I have no idea what "${commandName}" is. You're not making any sense. Try: \`@${name} help\``
    );
  }

  return Promise.resolve(command().fn(commandArgument, data, handlers)).then(normalizeOutput);
};
