/// <reference types="cypress" />

// https://www.npmjs.com/package/dotenv
require('dotenv').config()
// configs
const cyGrep = require('cypress-grep/src/plugin')
const codeCoverageTask = require('@bahmutov/cypress-code-coverage/plugin')
// tasks
const { initLaunchDarklyApiTasks } = require('cypress-ld-control')

module.exports = (on, config) => {
  const combinedTasks = {
    // add your other Cypress tasks if any
  }

  // https://github.com/bahmutov/cypress-ld-control
  if (
    process.env.LAUNCH_DARKLY_PROJECT_KEY &&
    process.env.LAUNCH_DARKLY_AUTH_TOKEN
  ) {
    const ldApiTasks = initLaunchDarklyApiTasks({
      projectKey: process.env.LAUNCH_DARKLY_PROJECT_KEY,
      authToken: process.env.LAUNCH_DARKLY_AUTH_TOKEN,
      environment: 'test' // the name of your environment to use
    })
    // copy all LaunchDarkly methods as individual tasks
    Object.assign(combinedTasks, ldApiTasks)
    // set an environment variable for specs to use
    // to check if the LaunchDarkly can be controlled
    config.env.launchDarklyApiAvailable = true
  } else {
    console.log('Skipping cypress-ld-control plugin')
  }

  on('task', combinedTasks)

  return Object.assign({}, config, codeCoverageTask(on, config), cyGrep)
}

require('@applitools/eyes-cypress')(module)
