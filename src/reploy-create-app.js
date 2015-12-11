#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import {appConf, appName} from './environment';
import api from './api';
import readlineSync from 'readline-sync';

if (appConf.app && appConf.app.id) {

  console.log("You already created this app. It's id is " + appConf.app.id);

} else {

  let name = readlineSync.question('Give this app a name:')

  api.query(`
    mutation createApp($input: _CreateApplicationInput!) {
      createApplication(input: $input) {
        id
      }
    }
  `, {input: {name: name}})
  .then((response) => {

    let appId = response.data.createApplication.id;

    appConf.app = {
      id: appId
    }

    appConf.save()

    console.log(`Created app with name ${name} and id ${appId}`)

  }).catch((error) => {
    console.log(error)
  })

}
