#!/usr/bin/env node

import cli from 'cli';
import pkg from '../package.json';
import program from 'commander';
import updateNotifier from 'update-notifier';

const notifier = updateNotifier({pkg, lastUpdateCheck: 0, updateCheckInterval: 1000})
notifier.notify({defer: false});

const app = program
  .version(pkg.version)
  .command('setup', 'Configure your Reploy credentials available at https://app.reploy.io/settings')
  .command('list-apps', 'List javascript bundle versions')
  .command('create', 'Add a React Native app')
  .command('push-build', 'Push an iOS or Android build')

app.parse(process.argv);

const commandExists = app.commands.some((cmd) => {
  return cmd._name == app.args[0];
});

if (app.args[0] && !commandExists) {
  console.log();
  cli.error(`That's not a command!`);
  app.outputHelp();
};
