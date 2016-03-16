#!/usr/bin/env node --harmony

import program from 'commander';

let command = null;

let reploy = program
  .version('0.1.0')
  .command('setup', 'Configure your Reploy credentials')
  .command('list-apps', 'List javascript bundle versions')
  .command('create', 'Add a React Native app')
  .command('push-build', 'Push an iOS or Android build')
  .command('push-js', 'Build and push a javascript bundle')
  .command('list-js', 'List javascript bundle versions');

if (process.env.REPLOY_ADMIN) {
  command = reploy
  .command('query', 'Run a graphql query from a file')
  .command('delete-all', 'Delete all data!')
  .command('list-hooks', 'List Reindex webhooks')
  .command('create-devices', 'Create devices')
  .command('invite-beta', 'Invite beta user');
} else {
  command = reploy;
}

command.parse(process.argv);
