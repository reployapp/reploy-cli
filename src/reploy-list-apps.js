#!/usr/bin/env node --harmony

import program from 'commander';
import {query} from './api';
import 'babel-polyfill';

async function run() {
  try {
    let user = await query(`
        user {
          applications {
            edges {
              node {
                name
              }
            }
          }
        }`);
    user.applications.edges.forEach((app) => {
      console.log(app.node.name)
    });
  } catch(error) {
    console.log(error);
  }
}

run();
