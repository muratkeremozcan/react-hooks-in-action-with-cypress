const { defineConfig } = require('cypress')

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
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      const skipAllSpecJs = config.isTextTerminal
        ? { excludeSpecPattern: ['src/components/all.cy.js'] }
        : {}

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
      if (config.isTextTerminal) {
        // skip the all.cy.js spec in "cypress run" mode
        return {
          excludeSpecPattern: ['src/components/all.cy.js']
        }
      }
    },
    specPattern: 'src/**/**/*.cy.{js,ts,jsx,tsx}',
    excludeSpecPattern: process.env.CI ? ['src/components/all.cy.js'] : []
  }
})
