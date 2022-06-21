// we want to be able to use the secure environment variable via dotenv
// https://www.npmjs.com/package/dotenv
require('dotenv').config()

module.exports = {
  // Think of this as parallelization
  // If you have a free account, then concurrency will be limited to 1.
  testConcurrency: 1,

  // we are using the environment variable we set in the .env file
  apiKey: process.env.APPLITOOLS_API_KEY,

  // If we have multiple projects such as App-A, App-b,
  // batchName property is used to differentiate between them at the Applitools dashboard
  batchName: 'React Hooks in Action',

  // 4 browsers x 3 viewports = 12 configs
  browser: [
    { width: 800, height: 600, name: 'chrome' }
    // { width: 1024, height: 600, name: 'chrome' },
    // { width: 1920, height: 1200, name: 'chrome' },
    // { width: 800, height: 600, name: 'firefox' },
    // { width: 1024, height: 600, name: 'firefox' },
    // { width: 1920, height: 1200, name: 'firefox' },
    // { width: 800, height: 600, name: 'safari' },
    // { width: 1024, height: 600, name: 'safari' },
    // { width: 1920, height: 1200, name: 'safari' },
    // { width: 800, height: 600, name: 'edge' },
    // { width: 1024, height: 600, name: 'edge' },
    // { width: 1920, height: 1200, name: 'edge' }

    // mobile browser conveniences are also available
    // { deviceName: 'Pixel 2', screenOrientation: 'portrait' },
    // { deviceName: 'Nexus 10', screenOrientation: 'landscape' }
  ]
}
