import {configFilename, globalConf} from './environment';
import request from 'superagent-bluebird-promise';

const CREDENTIALS = {"X-ApiId": globalConf.apiId, "X-ApiSecret": globalConf.apiSecret}
const BASE_URL = process.env['REPLOY_ENV'] === 'development' ? "http://localhost:5544/api/v1" : "http://reploy.io/api/v1"

if (!globalConf.apiId) {
  console.log(`It looks like you're not setup yet to use Reploy. Sign up at http://reploy.io or place your API configuration in ~/${configFileame}.!`);
  process.exit();
}

module.exports = {
  get: (path) => {
    return request.get(`${BASE_URL}${path}`).set(CREDENTIALS)
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
