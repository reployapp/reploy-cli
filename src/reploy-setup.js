#!/usr/bin/env node --harmony

import cli from 'cli';
import program from 'commander';
import readlineSync from 'readline-sync';

import { globalConfExists, globalConf, configFilename } from './environment';

if (!globalConf.token) {
  let token = readlineSync.question('Enter your API token from https://app.reploy.io/settings: ');
  globalConf.token = token;
  globalConf.save();
} else {
  cli.info(`You\'re already setup for reploy! Need to reset your token?. Remove the file at ~/${globalConf.__filename} and run this command again.`);
}
