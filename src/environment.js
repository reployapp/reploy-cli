import plist from 'plist';
import path from 'path';
import config from 'home-config';
import fs from 'fs';

const FILENAME = process.env["REPLOY_ENV"] === 'development' ? ".reploy.development" : ".reploy"
const appConfigPath = path.join(process.cwd(), FILENAME);

try {
  var file = fs.readFileSync(path.join(process.cwd(), 'iOS/Info.plist'), 'utf8')
  var appVersion = plist.parse(file).CFBundleShortVersionString
} catch (e) {
  if (e.code != 'ENOENT') {
    throw e
  }
}

module.exports = {
  globalConf: config.load(FILENAME),
  appConf: config.load(appConfigPath),
  appVersion: appVersion || null,
  appName: path.basename(process.cwd()),
  configFilename: FILENAME
}
