const { defineConfig } = require('cypress')
const codeCoverageTask = require('@bahmutov/cypress-code-coverage/plugin')

module.exports = defineConfig({
  projectId: 'nr3y7v',
  retries: {
    runMode: 2,
    openMode: 0
  },
  experimentalPolyfill: true,
  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true
  },
  e2e: {
    // We've imported your old cypress plugins here.
    setupNodeEvents(on, config) {
      const skipAllSpecJs = config.isTextTerminal
        ? { excludeSpecPattern: ['cypress/e2e/all.spec.js'] }
        : null

      return require('./cypress/plugins/index.js')(
        on,
        Object.assign({}, config, skipAllSpecJs)
      )
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    excludeSpecPattern: process.env.CI ? ['cypress/e2e/all.spec.js'] : []
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack'
    },
    setupNodeEvents(on, config) {
      const skipAllSpecJs = config.isTextTerminal
        ? { excludeSpecPattern: ['src/components/all.cy.js'] }
        : null

      return Object.assign(
        {},
        config,
        skipAllSpecJs,
        codeCoverageTask(on, config)
      )
    },
    specPattern: 'src/**/**/*.cy.{js,ts,jsx,tsx}',
    excludeSpecPattern: process.env.CI ? ['src/components/all.cy.js'] : []
  }
})
