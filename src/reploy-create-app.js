#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import {appConf, appName} from './environment';
import api from './api';


if (appConf.app && appConf.app.id) {

  console.log("You already created this app. It's id is " + appConf.app.id);

} else {

  api.post('/apps', {name: appName})
  .then((response) => {

    appConf.app = {
      id: response.body.id,
      apiId: response.body.api_id,
      apiSecret: response.body.api_secret
    }
    appConf.save()
    console.log(`Created app with name ${appName} and id ${response.body.id}`)

  }, (response) => {
    console.log('Error!')
    console.log(response.res.error)
  })
}
