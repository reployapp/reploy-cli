import plist from 'plist';
import path from 'path';
import config from 'home-config';
import fs from 'fs';

const FILENAME = process.env["REPLOY_ENV"] === 'development' ? ".reploy.development" : ".reploy"

module.exports = {
  globalConf: config.load(FILENAME),
  appConf: config.load(path.join(process.cwd(), FILENAME)),
  appVersion: plist.parse(fs.readFileSync(path.join(process.cwd(), 'iOS/Info.plist'), 'utf8')).CFBundleShortVersionString,
  appName: path.basename(process.cwd()),
  configFilename: FILENAME
}
