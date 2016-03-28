#!/usr/bin/env node --harmony

import program from 'commander';
import { createReployToken } from './util';
import { version } from '../package.json';

let command = program
  .version(version)
  .option('-t, --set-token [value]', 'Set Reploy API Token. Available at https://app.reploy.io/settings', (token) => createReployToken(token))
  .command('setup', 'Configure your Reploy credentials')
  .command('list-apps', 'List javascript bundle versions')
  .command('create', 'Add a React Native app')
  .command('push-build', 'Push an iOS or Android build')
  .command('push-js', 'Build and push a javascript bundle')
  .command('list-js', 'List javascript bundle versions');

command.parse(process.argv);
