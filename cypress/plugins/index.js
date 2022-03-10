/// <reference types="cypress" />

const reactScripts = require('@cypress/react/plugins/react-scripts')
const cyGrep = require('cypress-grep/src/plugin')
const codeCoverageTask = require('@cypress/code-coverage/task')

module.exports = (on, config) => {
  const injectDevServer =
    config.testingType === 'component' ? reactScripts : () => ({})

  return Object.assign(
    {},
    codeCoverageTask(on, config),
    injectDevServer(on, config),
    cyGrep
  )
}
