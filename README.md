# React Hooks in Action Book, with Cypress e2e & component tests

![react version](https://img.shields.io/badge/react-17.0.2-brightgreen) ![react-scripts version](https://img.shields.io/badge/react--scripts-4.0.3-brightgreen) ![cypress version](https://img.shields.io/badge/cypress-9.3.1-brightgreen) ![@cypress/react version](https://img.shields.io/badge/@cypress/react-5.12.1-brightgreen) ![@cypress/webpack-dev-server version](https://img.shields.io/badge/@cypress/webpack--dev--server-1.8.0-brightgreen) [![renovate-app badge][renovate-badge]][renovate-app]

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/

```bash
yarn install --registry https://registry.yarnpkg.com # specify the registry in case you are using a proprietary registry

yarn start # start the server
yarn cy:open # for cypress e2e test runner
yarn cy:run # headless version

# no need to have server running for these:
yarn cy:open-ct # for cypress component test runner
yarn cy:run-ct # headless version

yarn test # run unit tests with jest

# use server-test to start the app and run e2e (the app should not already be running)
yarn server:test
```

## CI

```
build  -->  Cypress e2e test
       -->  Cypress component test
       -->  lint
```

---

## Component Testing

Followed the instructions at [Getting Started with Cypress Component Testing (React)](https://www.cypress.io/blog/2021/04/06/cypress-component-testing-react/).

Minimal instructions:

1. `yarn add -D @cypress/react @cypress/webpack-dev-server`, add `cy:open-ct` and `cy:run-ct` scripts to `package.json`.

2. Modify the cypress.json for - distinct from other unit tests hence the naming `comp-test`:

   ```json
   {
   "baseUrl": "http://localhost:3000",
   "component": {
       "testFiles": "**/*.ct-spec.{js,ts,jsx,tsx}",
       "componentFolder": "src"
   }
   ```

3. Enhance the plugins/index file with the component test configuration. The dev server depends on your react setup.

```json
const injectDevServer = require("@cypress/react/plugins/react-scripts")

module.exports = (on, config) => {
  injectDevServer(on, config)
  return config
}
```

Launch component test runner with `yarn cy:open-ct`.

4. The component test CI setup can be isolated, or can be steps after the e2e steps

```yml
component-test:
    needs: [install-dependencies]]
    runs-on: ubuntu-latest
    container: cypress/included:9.3.1 # save time on not having to install cypress
    steps:
    - uses: actions/checkout@v2

    - uses: bahmutov/npm-install@v1 # save time on dependencies
        with: { useRollingCache: true }

    # the docs advise to run component tests after the e2e tests, this part could also be right after e2e tests
    - name: Cypress component tests 🧪
        uses: cypress-io/github-action@v2.11.7
        with:
        # we have already installed everything
        install: false
        # to run component tests we need to use "cypress run-ct"
        command: yarn cypress run-ct
```
