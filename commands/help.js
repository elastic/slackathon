import commands from './index';

export default () => ({
  help: 'Get a list of commands, or help for a command',
  example: '',
  fn: args => {
    const commandName = args.trim();
    const command = commands[commandName];
    if (!command) return `My commands are: ${Object.keys(commands).join(', ')}`;

    return `${commandName}: ${command().help}. For example: "${commandName} ${command().example}"`;
  },
});
