#!/usr/bin/env node --harmony

import program from 'commander';
import 'babel-polyfill';

program
  .version('0.1.0')
  .command('setup', 'Configure credentials for the Reploy API')
  .command('list-apps', 'List javascript bundle versions')
  .command('create-app', 'Create this app on Reploy')
  .command('push-binary', 'Push an application binary')
  .command('push-js', 'Build and push a javascript bundle')
  .command('list-js', 'List javascript bundle versions')
  .command('query', 'Run a graphql query from a file')
  .command('delete-all', 'Delete all data!')
  .parse(process.argv);
