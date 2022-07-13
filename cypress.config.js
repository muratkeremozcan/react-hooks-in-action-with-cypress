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
      bundler: 'webpack',
      webpackConfig: {
        mode: 'development',
        devtool: false,
        module: {
          rules: [
            // application and Cypress files are bundled like React components
            // and instrumented using the babel-plugin-istanbul
            // (we will filter the code coverage for non-application files later)
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react'],
                  plugins: [
                    // we could optionally insert this plugin
                    // only if the code coverage flag is on
                    'istanbul',
                    [
                      '@babel/plugin-transform-modules-commonjs',
                      { loose: true },
                    ],
                  ],
                },
              },
            },
          ],
        },
      },
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
