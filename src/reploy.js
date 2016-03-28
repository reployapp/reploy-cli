#!/usr/bin/env node --harmony

import program from 'commander';
import { createReployToken } from './util';
import { version } from '../package.json';

let command = program
  .version(version)
  .command('setup', 'Configure your Reploy credentials available at https://app.reploy.io/settings')
  .command('list-apps', 'List javascript bundle versions')
  .command('create', 'Add a React Native app')
  .command('push-build', 'Push an iOS or Android build')
  .command('list-js', 'List javascript bundle versions');

command.parse(process.argv);
