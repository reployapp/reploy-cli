#!/usr/bin/env node --harmony

import program from 'commander';

let command = program
  .version('0.1.0')
  .command('setup', 'Configure your Reploy credentials')
  .command('list-apps', 'List javascript bundle versions')
  .command('create', 'Add a React Native app')
  .command('push-build', 'Push an iOS or Android build')
  .command('push-js', 'Build and push a javascript bundle')
  .command('list-js', 'List javascript bundle versions');

command.parse(process.argv);
