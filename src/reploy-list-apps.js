#!/usr/bin/env node

import { query } from './api';
import Table from 'cli-table';
import colors from 'colors';

const table = new Table({
  head: [
    colors.cyan('ID'),
    colors.cyan('Name'),
    colors.cyan('Screenshots'),
    colors.cyan('Testers')
  ],
  colWidths: [15, 20, 15, 10]
});

async function run() {
  try {
    let result = await query(`
      user {
        applications {
          count,
          nodes {
            id,
            urlToken,
            name,
            screenshots {
              count,
            }
            invitedUsers {
              count
            }
          }
        }
      }`);

    const { applications } = result.user;

    if (applications.count === 0) {
      console.log('Uh oh! No applications found. \nPlease make sure you\'ve created an app and that your accounts token is set in /~.reploy');
    } else {
      applications.nodes.forEach((app) => {
        table.push([
          app.urlToken,
          app.name,
          app.screenshots.count,
          app.invitedUsers.count
        ]);
      });
      console.log(table.toString());
    }
  } catch(error) {
    console.log(error);
  }
}

run();
