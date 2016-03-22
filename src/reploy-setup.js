#!/usr/bin/env node --harmony

import cli from 'cli';
import program from 'commander';
import readlineSync from 'readline-sync';

import { globalConf, configFilename } from './environment';
import { checkForConfig, createReployToken } from './util'
console.log(globalConf)
if (!globalConf) {
  let token = readlineSync.question('Enter your API token: ');
  createReployToken(token);
} else {
  cli.ok(`You're already setup for reploy!\n\n Need to reset your token?.\n Use the following command. 'reploy --set-token {token}'`);
}
