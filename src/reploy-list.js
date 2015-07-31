#!/usr/bin/env node --harmony

import program from 'commander';
import superagent from 'superagent';
import config from 'home-config';
import {appConf, appVersion} from './environment';
import timeago from 'timeago';

if (!appConf.app) {

  console.log("You need to create this app first with: reploy create");

} else {

  superagent.get(`http://reploy.io/apps/${appConf.app.id}/${appVersion}/js_versions`)
    .end(function(err, response) {

      if (response.ok) {
        response.body.map((version) => {
          console.log(`${version.bundle_hash} ${timeago(new Date(version.created_at))}`);
        });
      } else {
        console.log('Error!');
        console.log(response);
      }

    });
}
