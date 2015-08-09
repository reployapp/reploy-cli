#!/usr/bin/env node --harmony

var program = require('commander');


program
  .version('0.1.0')
  .command('list-apps', 'list javascript bundle versions')
  .command('create-app', 'Create this app on Reploy')
  .command('push-js', 'Build and push a javascript bundle')
  .command('list-js', 'list javascript bundle versions')
  .parse(process.argv);
