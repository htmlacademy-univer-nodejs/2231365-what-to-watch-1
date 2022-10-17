#!/usr/bin/env node

import VersionCommand from './cli-command/version-command.js';
import HelpCommand from './cli-command/help-command.js';
import CliApplication from './app/cli-application.js';
import ImportCommand from './cli-command/import-command.js';
import GenerateCommand from './cli-command/generate-command.js';

const manager = new CliApplication();
manager.registerCommands([
  new HelpCommand, new VersionCommand, new ImportCommand, new GenerateCommand
]);
manager.processCommand(process.argv);
