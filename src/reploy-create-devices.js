#!/usr/bin/env node --harmony

import {mutation, query, getApplication} from './api';

const measurements = {
  nexus5: {
    width: 360,
    height: 640,
    phoneWidth: 400,
    phoneHeight: 795,
    screenOffsetTop: 67,
    screenOffsetLeft: 20,
  },
  nexus7: {
    width: 600,
    height: 960,
    phoneWidth: 728,
    phoneHeight: 1268,
    screenOffsetTop: 155,
    screenOffsetLeft: 64,
  },
  nexus9: {
    width: 768,
    height: 1024,
    phoneWidth: 866,
    phoneHeight: 1288,
    screenOffsetTop: 133,
    screenOffsetLeft: 49,
  },
  iphone6: {
    width: 375,
    height: 668,
    phoneWidth: 416,
    phoneHeight: 870,
    screenOffsetTop: 100,
    screenOffsetLeft: 21,
  },
  iphone4s: {
    width: 320,
    height: 480,
    phoneWidth: 370,
    phoneHeight: 733,
    screenOffsetTop: 125,
    screenOffsetLeft: 25,
  },
  iphone5s: {
    width: 320,
    height: 568,
    phoneWidth: 365,
    phoneHeight: 782,
    screenOffsetTop: 105,
    screenOffsetLeft: 22,
  },
  iphone6plus: {
    width: 621,
    height: 1104,
    phoneWidth: 690,
    phoneHeight: 1420,
    screenOffsetTop: 160,
    screenOffsetLeft: 35,
  },
  ipadair: {
    width: 768,
    height: 1024,
    phoneWidth: 864,
    phoneHeight: 1287,
    screenOffsetTop: 130,
    screenOffsetLeft: 48,
  },
};

measurements.iphone6s = measurements.iphone6;
measurements.iphone6splus = measurements.iphone6plus;
measurements.ipadair2 = measurements.ipadair;

export const DEVICES = [
  { make: 'iphone4s', platform: 'ios', os: '8.4', label: 'iPhone4s - 8.4'},
  { make: 'iphone4s', platform: 'ios', os: '9.0', label: 'iPhone4s - 9.0'},
  { make: 'iphone5s', platform: 'ios', os: '8.4', label: 'iPhone5s - 8.4'},
  { make: 'iphone5s', platform: 'ios', os: '9.0', label: 'iPhone5s - 9.0'},
  { make: 'iphone6', platform: 'ios', os: '8.4', label: 'iPhone6 - 8.4'},
  { make: 'iphone6', platform: 'ios', os: '9.0', label: 'iPhone6 - 9.0'},
  { make: 'iphone6plus', platform: 'ios', os: '8.4', label: 'iPhone6+ - 8.4'},
  { make: 'iphone6plus', platform: 'ios', os: '9.0', label: 'iPhone6+ - 9.0'},
  { make: 'iphone6s', platform: 'ios', os: '9.0', label: 'iPhone6s - 9.0', default: true},
  { make: 'iphone6splus', platform: 'ios', os: '9.0', label: 'iPhone6s+ - 9.0'},
  { make: 'ipadair', platform: 'ios', os: '8.4', label: 'iPad Air - 8.4'},
  { make: 'ipadair', platform: 'ios', os: '9.0', label: 'iPad Air - 9.0'},
  { make: 'ipadair2', platform: 'ios', os: '9.0', label: 'iPad Air 2 - 9.0'},

  { make: 'nexus5', platform: 'android', os: '4.4', label: 'Nexus 5 - 4.4'},
  { make: 'nexus5', platform: 'android', os: '5.1', label: 'Nexus 5 - 5.1'},
  { make: 'nexus5', platform: 'android', os: '6.0', label: 'Nexus 5 - 6.0'},

//  { make: 'hammerhead', platform: 'android', os: '5.1.1', label: 'Real Nexus 5 - 6.0', width: 540, height: 960},
  { make: 'nexus7', platform: 'android', os: '4.4', label: 'Nexus 7 - 4.4'},
  { make: 'nexus7', platform: 'android', os: '5.1', label: 'Nexus 7 - 5.1'},
  { make: 'nexus7', platform: 'android', os: '6.0', label: 'Nexus 7 - 6.0', default: true},
  { make: 'nexus9', platform: 'android', os: '4.4', label: 'Nexus 9 - 4.4'},
  { make: 'nexus9', platform: 'android', os: '5.1', label: 'Nexus 9 - 5.1'},
  { make: 'nexus9', platform: 'android', os: '6.0', label: 'Nexus 9 - 6.0'},
];

async function createDevice(device, index, existingDevices) {
  device = {...device, ...measurements[device.make]};

  let data = {
    order: index,
    label: device.label,
    make: device.make,
    os: device.os,
    platform: device.platform,
    width: device.width,
    height: device.height,
    phoneHeight: device.phoneHeight,
    phoneWidth: device.phoneWidth,
    screenOffsetTop: device.screenOffsetTop,
    screenOffsetLeft: device.screenOffsetLeft,
    createdAt: '@TIMESTAMP',
    updatedAt: '@TIMESTAMP',
    default: device.default,
  };

  let existingDevice = existingDevices.find(existingDevice => existingDevice.label == device.label);

  let operation =  existingDevice ? 'update' : 'create';

  if (operation == 'update') {
    data.id = existingDevice.id;
  }

  console.log(`Processing ${operation} for ${data.label}`);

  return await mutation(`${operation}Device`, data);
}

async function run() {
  try {

    const result = await query(`
      allDevices(first: 100) {
        nodes {
          id,
          label
        }
      }
    `);

    console.log('Creating or updating devices...')
    await Promise.all(DEVICES.map((device, index) => createDevice(device, index, result.allDevices.nodes)));
    console.log('Done!');
  } catch (error) {
    console.error(error)
  }
}

run();
