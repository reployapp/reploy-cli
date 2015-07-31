#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import superagent from 'superagent';
import {appConf, appName} from './environment';


if (appConf.app && appConf.app.id) {

  console.log("You already created this app. It's id is " + appConf.app.id);

} else {

  superagent.post('http://reploy.io/apps')
    .send({name: appName})
    .end(function(err, response) {

      if (response.ok) {
        appConf.app = {
          id: response.body.id
        }
        appConf.save();
        console.log(`Created app with name ${appName} and id ${response.body.id}`);
      } else {
        console.log('Error!');
        console.log(response);
      }

    });
}
