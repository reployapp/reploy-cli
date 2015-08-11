#!/usr/bin/env node --harmony

import program from 'commander';
import superagent from 'superagent';
import config from 'home-config';
import timeago from 'timeago';
import api from './api';

api.get('/apps')
  .then((response) => {
      response.body.apps.map((app) => {
        console.log(`${app.unique_id} ${app.name} ${timeago(new Date(app.created_at))}`)
      })
    }, ((response) => {
      console.log(response.res.error)
    }));
