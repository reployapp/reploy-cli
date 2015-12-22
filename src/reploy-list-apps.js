#!/usr/bin/env node --harmony

import program from 'commander';
import {query} from './api';
import 'babel-polyfill';

async function run() {
  try {
    let result = await query(`
        user {
          applications {
            edges {
              node {
                name
              }
            }
          }
        }`);

    result.user.applications.edges.forEach((app) => {
      console.log(app.node.name)
    });
  } catch(error) {
    console.log(error);
  }
}

run();
