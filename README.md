# React Hooks in Action Book, with Cypress e2e & component tests ![react version](https://img.shields.io/badge/react-17.0.2-brightgreen) ![react-scripts version](https://img.shields.io/badge/react--scripts-4.0.3-brightgreen)

[![react-hooks-in-action](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/nr3y7v/main&style=flat-square&logo=cypress)](https://dashboard.cypress.io/projects/nr3y7v/runs) [![Build, Lint, e2e & ct test](https://github.com/muratkeremozcan/react-hooks-in-action-with-cypress/actions/workflows/main.yml/badge.svg?branch=main&event=push)](https://github.com/muratkeremozcan/react-hooks-in-action-with-cypress/actions/workflows/main.yml)
![cypress version](https://img.shields.io/badge/cypress-9.4.1-brightgreen) ![@cypress/react version](https://img.shields.io/badge/@cypress/react-5.12.4-brightgreen) ![@cypress/webpack-dev-server version](https://img.shields.io/badge/@cypress/webpack--dev--server-1.8.4-brightgreen) [![renovate-app badge][renovate-badge]][renovate-app]

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/

```bash
yarn install --registry https://registry.yarnpkg.com # specify the registry in case you are using a proprietary registry

# no need to have server running for these:
yarn cy:open-ct # for cypress component test runner
yarn cy:run-ct # headless version

# runs the ui and api servers, then opens e2e runner
yarn cy:open-e2e
yarn cy:run-e2e  # headless version

# a la carte
yarn dev # start the ui and api server
yarn cy:open # for cypress e2e test runner
yarn cy:run # headless version

yarn test # run unit tests with jest
```

## CI

```
build  -->  Cypress e2e test
       -->  Cypress component test
       -->  lint
```

---

## What to test where: component vs ui-integration vs ui-e2e

TL,DR; test everything you can at the lowest level component; when that is limiting move to the parent, when that is limiting move further up; ui-integration (ui-component-integration, stubs the network) and ui-e2e where backend is needed. Most of the time the backend is not needed.

> Example component setup:
>
> - BookablesPage (routes - _ui-integration_)
>   - BookablesView (parent - _component test_)
>     - BookablesList (child - _component test_)
>     - BookableDetails (child - _component test_)
>   - BookableEdit (parent - _component test_)
>     - BookableForm (child - _component test_)
>   - BookableNew (parent - _component test_)
>     - BookableForm (child - _component test_)

- test at the parent component when you cannot test any further at child

- test via ui-integration when that is limiting, and also when you want to test an integration of ui components

- test via ui-e2e when back-end matters

  > An example of needing backend is when CRUD is of concern.
  > An ideal crud utilizes api seeding, but here we did it all through the UI.
  >
  > - Test UI Create
  >   - UI create
  >   - API delete
  > - Test UI Update
  >   - API create
  >   - UI update
  >   - API delete
  > - Test UI Delete
  >   - API create
  >   - UI delete

- Finally, do combined coverage and fill the gaps

## Combined Coverage

<details><summary>details</summary>

Quick setup for CRA.

[Reference PR](https://github.com/muratkeremozcan/react-hooks-in-action-with-cypress/pull/64/files)

- Add packages: `@cypress/code-coverage` `@cypress/instrument-cra` `istanbul-lib-coverage` `nyc`

- Modify `package.json`/`scripts`/`start`

  ```json
  "start": "react-scripts -r @cypress/instrument-cra start",
  ```

- Add a config for nyc to `package.json`

  ```json
  "nyc": {
    "extension": [
      ".js"
    ],
    "include": [
      "src/**/*.js",
    ]
  }
  ```

- Add a convenience script to reset e2e coverage

  ```json
  "coverage:reset": "rm -rf .nyc_output && rm -rf coverage"
  ```

- Setup `cypress/plugins/index.js`

  ```js
  const reactScripts = require('@cypress/react/plugins/react-scripts') // for component testing...
  const cyGrep = require('cypress-grep/src/plugin')
  const codeCoverageTask = require('@cypress/code-coverage/task') // new plugin for code coverage

  module.exports = (on, config) => {
    // for component testing, can become obsolete  in Cypress 10
    const injectDevServer =
      config.testingType === 'component' ? reactScripts : () => ({})

    // combine the plugin config and return
    return Object.assign(
      {},
      injectDevServer(on, config),
      codeCoverageTask(on, config),
      cyGrep
    )
  }
  ```

- Setup `cypress/support/index.js`

  ```js
  import '@cypress/code-coverage/support'
  ```

  </details>

## Component Testing

<details><summary>details</summary>

Followed the instructions at [Getting Started with Cypress Component Testing (React)](https://www.cypress.io/blog/2021/04/06/cypress-component-testing-react/).

Minimal instructions:

1. `yarn add -D @cypress/react @cypress/webpack-dev-server`, add `cy:open-ct` and `cy:run-ct` scripts to `package.json`.

2. Modify the cypress.json for test file naming. Cypress recommends ComponentName.cy.js for Cypress component tests so folks can stick with ComponentName.spec.js for their jest tests `cy.js`:

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
    needs: [install-dependencies]
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

</details>

## cypress-grep cheat sheet

<details><summary>details</summary>

```bash
# note: can use run or open

# strings
yarn cy:run --env grep=retainment # run by a string in the spec file
yarn cy:run --env grep="Bookable details retainment" # multiple words

# solo spec; no skipped tests in results
yarn cy:run --env grep="Bookable details retainment" --spec 'cypress/integration/retainment.spec.js'
yarn cy:run --env grep="Bookable details retainment",grepFilterSpecs=true # newer way
yarn cy:open --env grep="Bookable details retainment",grepFilterSpecs=true,grepOmitFiltered=true # omits greyed out tests, good for open mode

# tags
yarn cy:run --env grepTags=@smoke # run by a tag in the spec file
# logic combos
yarn cy:run --env grepTags="@smoke @routes" # OR
yarn cy:run --env grepTags="@appJs+@routes" # AND

# reversion
yarn cy:run --env grep=-sanity # runs the tests without sanity string in the spec
yarn cy:run --env grep="- abcs" # string variant
yarn cy:run --env grepTags="-@routes" # tags, can drop quotes if single tag


# mix string and tag, AND logic
yarn cy:run --env grep="routes",grepTags="@appJs"

# burn; run it x times
yarn cy:run --env grepTags=@smoke,burn=10

# run untagged tests
yarn cy:run --env grepUntagged=true

# run a component test (filtering does not work with component tests yet)
# wait for Cypress 10
yarn cy:run-ct --env grep="BookingsPage",grepFilterSpecs=true,grepOmitFiltered=true

```

</details>

## Setting up and Testing LaunchDarkly Feature flags

The specs in the launch-darkly folder will not be working until you have aa `.env` file with your LaunchDarkly API key. You can add a property to your `cypress.json` file to disable the feature flag tests until you have an api key.

```json
{
  "ignoreTestFiles": "**/feature-flags/*.js"
}
```

Check out the multi-part series:

- [Effective Test Strategies for Testing Front-end Applications using LaunchDarkly Feature Flags and Cypress. Part1: the setup](https://dev.to/muratkeremozcan/effective-test-strategies-for-testing-front-end-applications-using-launchdarkly-feature-flags-and-cypress-part1-the-setup-jfp)
- [Effective Test Strategies for Testing Front-end Applications using LaunchDarkly Feature Flags and Cypress. Part2: testing](https://dev.to/muratkeremozcan/effective-test-strategies-for-testing-front-end-applications-using-launchdarkly-feature-flags-and-cypress-part2-testing-2c72)

A version of the app without feature flags can be checked out at the branch `before-feature-flags`. The PR for the blog post can be found [here](https://github.com/muratkeremozcan/react-hooks-in-action-with-cypress/pull/76).

## Setting up Visual Testing with Percy

The branch prior to the changes can be checked out at `before-visual-testing`. The steps can be followed to reach the final version on main branch.

The changes the guide can be found in [this PR](https://github.com/muratkeremozcan/react-hooks-in-action-with-cypress/pull/99).

Check out the full guide on [dev.to](https://dev.to/muratkeremozcan/painlessly-setup-cypress-percy-with-github-actions-in-minutes-1aki)

</details>
