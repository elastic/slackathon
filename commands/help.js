import { name } from '../config.json';
import commands from './index';

export default () => ({
  help: 'Get a list of commands, or help for a command',
  example: 'whomadeyou',
  fn: args => {
    const commandName = args.trim();
    const command = commands[commandName];
    if (!command)
      return `My commands are: ${Object.keys(commands)
        .map(command => `*${command}*`)
        .sort()
        .join(
          ', '
        )}. For more information on a function, try something like: \`@${name} help random\``;

    return `${commandName}: ${command().help}. For example: \`@${name} ${commandName} ${
      command().example
    }\``;
  },
});
