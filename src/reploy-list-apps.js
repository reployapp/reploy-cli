#!/usr/bin/env node --harmony

import program from 'commander';
import api from './api';


api.query(`query {
  viewer {
    allApplications {
      edges {
        node {
          name
        }
      }
    }
  }
}`).then((result) => {
  result.data.viewer.allApplications.edges.forEach((app) => {
    console.log(app.node.name)
  })
}).catch((error) => {
  console.log(error)
})
