#!/usr/bin/env node --harmony

var program = require('commander');


program
  .version('0.1.0')
  .command('create', 'Create this app on Reploy')
  .command('push', 'Build and push a javascript bundle')
  .command('list', 'list javascript bundle versions')
  .parse(process.argv);
