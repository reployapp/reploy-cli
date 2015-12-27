#!/usr/bin/env node --harmony

import program from 'commander';
import {query} from './api';
import 'babel-polyfill';

async function run() {
  try {
    let result = await query(`
      allReindexHooks {
        edges {
          node {
            id,
            url,
            fragment,
            trigger
          }
        }
      }
    `);
    result.allReindexHooks.edges.forEach((hook) => {
      console.log(hook.node)
    });
  } catch(error) {
    console.log(error);
  }
}

run();
