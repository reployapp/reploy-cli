#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import superagent from 'superagent';
import {appConf} from './environment';


if (appConf.app && appConf.app.id) {

  console.log("You already created this app. It's id is " + appConf.app.id);

} else {

  superagent.post('http://reploy.io/apps')
    .end(function(err, response) {

      if (response.ok) {
        appConf.app = {
          id: response.body.id
        }
        appConf.save();
        console.log("Created app with id " + response.body.id);
      } else {
        console.log('Error!');
        console.log(response);
      }

    });
}
