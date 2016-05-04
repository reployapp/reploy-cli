#!/usr/bin/env node --harmony

import program from 'commander';
import { version } from '../package.json';
import cli from 'cli';
import updateNotifier from 'update-notifier';
const pkg = require('../package.json');

updateNotifier({pkg: pkg}).notify({defer: false});

let app = program
  .version(version)
  .command('setup', 'Configure your Reploy credentials available at https://app.reploy.io/settings')
  .command('list-apps', 'List javascript bundle versions')
  .command('create', 'Add a React Native app')
  .command('push-build', 'Push an iOS or Android build')

app.parse(process.argv);

let commandExists = app.commands.some((cmd) => {
  return cmd._name == app.args[0];
});

if (app.args[0] && !commandExists) {
  console.log();
  cli.error(`That's not a command!`);
  app.outputHelp();
};
