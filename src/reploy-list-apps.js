#!/usr/bin/env node --harmony

import program from 'commander';
import superagent from 'superagent';
import config from 'home-config';
import {globalConf, appConf, appVersion} from './environment';
import timeago from 'timeago';


if (!globalConf.apiId) {
  console.log(globalConf)
  console.log("No configuration found at ~/.reploy. Maybe you need to sign up at http://reploy.io first!");

} else {

  superagent.get(`http://reploy.io/api/v1/apps`)
    .set("X-ApiId", globalConf.apiId)
    .set("X-ApiSecret", globalConf.apiSecret)
    .end(function(err, response) {

      if (response.ok) {
        response.body.apps.map((app) => {
          console.log(`${app.name} ${timeago(new Date(app.created_at))}`);
        });
      } else {
        console.log('Error!');
        console.log(response);
      }

    });
}
