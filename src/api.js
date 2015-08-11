import {configFilename, globalConf} from './environment';
import request from 'superagent-bluebird-promise';
import cli from 'cli';

if (globalConf && globalConf.auth) {

  if (!globalConf.auth.apiId) {
    cli.error(`It looks like you're not setup yet to use Reploy. Get started with: reploy setup`);
    process.exit();
  }

  var CREDENTIALS = {"X-ApiId": globalConf.auth.apiId, "X-ApiSecret": globalConf.auth.apiSecret}
}

const BASE_URL = process.env['REPLOY_ENV'] === 'development' ? "http://localhost:5544/api/v1" : "https://reploy.io/api/v1"

module.exports = {
  get: (path) => {
    return request.get(`${BASE_URL}${path}`).set(CREDENTIALS)
  },
  post_without_auth: (path, params) => {
    return request.post(`${BASE_URL}${path}`).send(params)
  },
  post: (path, params) => {
    var req = request.post(`${BASE_URL}${path}`).set(CREDENTIALS)

    if (params.attachments) {
      params.attachments.forEach((attachment) => {
        req.attach(attachment.field, attachment.path)
      })
      return req
    } else {
      return req.send(params)
    }
  },
  put: (path) => {
    return request.put(`${BASE_URL}${path}`).set(CREDENTIALS)
  },
  delete: (path) => {
    return request.delete(`${BASE_URL}${path}`).set(CREDENTIALS)
  }
}
