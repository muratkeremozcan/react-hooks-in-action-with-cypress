/// <reference types="cypress" />

module.exports = (on, config) => {
  if (config.testingType === 'component') {
    require('@cypress/react/plugins/react-scripts')(on, config)
  }
  require('cypress-grep/src/plugin')(config)

  return config
}
