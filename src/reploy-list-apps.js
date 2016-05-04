#!/usr/bin/env node

import { query } from './api';
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
