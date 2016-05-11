import cli from 'cli';
import fs  from 'fs';
import path from 'path';
import process from 'process';
import { appConf } from '../environment';
import { capitalize, getProjectName } from '../util';
import { getApplication, query, mutation } from '../api';

const superagent = require('superagent-promise')(require('superagent'), Promise);

export const buildPathIos = `/tmp/${getProjectName()}-ios.zip`;
export const buildPathAndroid = path.join(process.cwd(), '/android/app/build/outputs/apk/app-release.apk');

let application = null;

export async function uploadBuild(platform, options = {}) {

  try {
    const buildPath = options.buildPath ? options.buildPath : (platform === 'ios' ? buildPathIos : buildPathAndroid);
    try {
      fs.accessSync(buildPath, fs.F_OK);
    } catch (e) {
      if (platform === 'android') {
        cli.error(`Couldn't find a signed Android APK at ${buildPath}.\n \
  Please setup Android code signing as described here: https://facebook.github.io/react-native/docs/signed-apk-android.html#content\n \
  If you have a custom build path, specify it with the -b option.`);
      } else {
        cli.error(`Couldn't find the iOS build zip file at ${buildPath}. Please contact support: support@reploy.io.`);
      }
      process.exit(1);
    }

    application = await getApplication(options.applicationId);
    let uploadId = await uploadToUploadCare(buildPath);
    addBuildtoReploy(uploadId, platform, options.name);
  } catch (error) {
    console.log(error);
  }
}

async function uploadToUploadCare(filePath) {
  console.log(`Uploading build from ${filePath}...`);
  try {
    let response = await superagent.post('https://upload.uploadcare.com/base/')
      .field('UPLOADCARE_PUB_KEY', '9e1ace5cb5be7f20d38a')
      .attach('file', filePath)
      .on('progress', (progress) => {
        cli.progress(progress.loaded / progress.total);
      });

    cli.debug(`Upload id ${response.body.file}`)
    return (response.body.file);

  } catch (error) {
    console.log(error);
  }
}

async function addBuildtoReploy(uploadId, platform, name = null) {
  try {
    await mutation('createBinaryUpload', {
      uploadId: uploadId,
      user: application.user.id,
      platform: platform,
      name: name,
      application: application.id,
      createdAt: '@TIMESTAMP',
    });
  } catch(error) {
    console.log(error)
  }
}
