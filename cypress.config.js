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
      // use a custom webpackConfig to stub imported modules
      // https://glebbahmutov.com/blog/stub-react-import/#stub-the-import
      // install @babel/plugin-transform-modules-commonjs" and insert it into the transpiling pipeline
      // you (might) also need @babel/preset-env @babel/preset-react
      // with loose: true we can make all imports accessible from spec files
      webpackConfig: {
        mode: 'development',
        devtool: false,
        module: {
          rules: [
            {
              test: /\.?js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react'],
                  plugins: [
                    [
                      '@babel/plugin-transform-modules-commonjs',
                      { loose: true }
                    ]
                  ]
                }
              }
            }
          ]
        }
      }
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
