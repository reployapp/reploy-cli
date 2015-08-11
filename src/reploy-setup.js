#!/usr/bin/env node --harmony

import program from 'commander';
import {globalConf, configFilename} from './environment';
import cli from 'cli';
import tty from 'tty';
import readlineSync from 'readline-sync';
import api from './api';



if (!globalConf.auth) {

  var email = readlineSync.question('Enter your email address:')
  var password = readlineSync.question('Enter a password:', {hideEchoBack: true})

  api.post_without_auth('/users', {email: email, password: password})
    .then((response) => {
      globalConf.auth = {apiId: response.res.body.secret_id, apiSecret: response.res.body.secret}
      globalConf.save()
      cli.ok("You're all setup! Next, register your app from within its directory with: reploy create-app")
    }, (error) => {
      console.log(error.res.body);
    });

} else {
  cli.ok(`You're already setup for reploy! To start over, remove the ~/${configFilename} file.`)
}
