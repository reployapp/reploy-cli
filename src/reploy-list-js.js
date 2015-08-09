#!/usr/bin/env node --harmony

import program from 'commander';
import superagent from 'superagent';
import config from 'home-config';
import {globalConf, appConf, appVersion} from './environment';
import timeago from 'timeago';

if (!appConf.app) {

  console.log("You need to create this app first with: reploy create");

} else {

  superagent.get(`http://reploy.io/api/v1/apps/${appConf.app.id}/${appVersion}/js_versions`)
    .set("X-ApiId", globalConf.apiId)
    .set("X-ApiSecret", globalConf.apiSecret)
    .end(function(err, response) {

      if (response.ok) {
        response.body.map((version) => {
          console.log(`${version.version_number} ${version.bundle_hash} ${timeago(new Date(version.created_at))}`);
        });
      } else {
        console.log('Error!');
        console.log(response);
      }

    });
}
