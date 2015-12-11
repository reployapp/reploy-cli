#!/usr/bin/env node --harmony

import program from 'commander';
import {globalConf, configFilename} from './environment';
import cli from 'cli';
import tty from 'tty';
import readlineSync from 'readline-sync';
import api from './api';



if (!globalConf.auth) {

  var email = readlineSync.question('Enter your email address:')
  // TODO: add an 'email verification code' to login here
} else {
  cli.ok(`You're already setup for reploy! To start over, remove the ~/${configFilename} file.`)
}
