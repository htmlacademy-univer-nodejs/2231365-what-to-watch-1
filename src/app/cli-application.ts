import {CliCommandInterface} from '../cli-command/cli-command.interface.js';

type ParsedCommand = {
  [key: string]: string[]
}

export default class CliApplication {
  private commands: {[propertyName: string]: CliCommandInterface} = {};
  private defaultCommand = '--help';

  private parseCommand(cliArgs: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command = '';

    return cliArgs.reduce((acc, item) => {
      if (item.startsWith('--')) {
        acc[item] = [];
        command = item;
      } else if (command && item) {
        acc[command].push(item);
      }
      return acc;
    }, parsedCommand);
  }

  public registerCommands(commandList: CliCommandInterface[]): void {
    commandList.reduce((acc, command) => {
      const cliCommand = command;
      acc[cliCommand.name] = cliCommand;
      return acc;
    }, this.commands);
  }

  public getCommand(commandName: string): CliCommandInterface {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArgs = parsedCommand[commandName] ?? [];
    command.execute(...commandArgs);
  }
}
