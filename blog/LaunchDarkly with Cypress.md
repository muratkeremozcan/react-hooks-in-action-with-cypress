# LaunchDarkly with Cypress

We are assuming you have been signed up, skimmed thorough [Getting started](https://docs.launchdarkly.com/home/getting-started) and have access to the LaunchDarkly (LD) dashboard. Throughout the guide we wil be using [this repo](https://github.com/muratkeremozcan/react-hooks-in-action-with-cypress), a mid-size React app with Cypress e2e, Cypress component tests, CI in GHA etc. Mind that LD trial period is 2 weeks, therefore signing up will be required to clone the repo and fully reproduce the examples. A version of the app without feature flags (FF) can be checked out at the branch `before-feature-flags`.

## Implement LD FFs for your React app

### Setup the project at LD interface

We will start by creating a new project, and switching to it.

![image-20220318061625659](/Users/murat/Library/Application Support/typora-user-images/image-20220318061625659.png)

The critical items to note are SDK key -since we are using React- and Client-side ID. These will connect our app to the LD service.
![image-20220318061920924](/Users/murat/Library/Application Support/typora-user-images/image-20220318061920924.png)

### Identify the flaggable features of the application

While going through the book [React Hooks in Action - Manning Publications](https://www.manning.com/books/react-hooks-in-action), adding tests, taking all kinds of liberties, a few additions were identified that would be good use cases for feature flags. We can start with `date and week`.

![image-20220318063311824](/Users/murat/Library/Application Support/typora-user-images/image-20220318063311824.png)

We can create a boolean flag for it. By default we want it off.

![image-20220318063439471](/Users/murat/Library/Application Support/typora-user-images/image-20220318063439471.png)

![image-20220318064125982](/Users/murat/Library/Application Support/typora-user-images/image-20220318064125982.png)

Here is how the component would look with the flag off. Here we are running a Cypress component test and commenting out the code, no magic.![image-20220318063828126](/Users/murat/Library/Application Support/typora-user-images/image-20220318063828126.png)

Here is how it would appear with the flag on.
![image-20220318063903477](/Users/murat/Library/Application Support/typora-user-images/image-20220318063903477.png)

### Connect the app with LD

We can follow the [React SDK reference](https://docs.launchdarkly.com/sdk/client-side/react/react-web#initializing-using-asyncwithldprovider) here. Start with installing `yarn add launchdarkly-react-client-sdk`; mind that it is a dependency vs a devDependency. The reference guide talks about using `withLDProvider` vs `asyncWithLDProvider`. My friend [Gleb already did an example with the former](https://glebbahmutov.com/blog/cypress-and-launchdarkly/), so we will try the async version here to ensure that the app does not flicker due to flag changes at startup time.

All we need to do is to create the async LD provider, identify our `clientSideID` (<https://app.launchdarkly.com/settings/projects>), and wrap the app.

```js
import ReactDOM from "react-dom";
import App from "./components/App.js";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";

// because we are using await, we have to wrap it all in an async IIFE
(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: "62346a0d87293a13********",
    // we do not want the React SDK to change flag keys to camel case
    // https://docs.launchdarkly.com/sdk/client-side/react/react-web#flag-keys
    reactOptions: {
      useCamelCaseFlagKeys: false,
    },
  });

  // wrap the app with LDProvider
  return ReactDOM.render(
    <LDProvider>
      <App />
    </LDProvider>,
    document.getElementById("root")
  );
})();
```

When we launch the app, we should already be seeing a GET request go out to LD, and the flag data is in the preview.

![image-20220318073737340](/Users/murat/Library/Application Support/typora-user-images/image-20220318073737340.png)

![image-20220318073807783](/Users/murat/Library/Application Support/typora-user-images/image-20220318073807783.png)

LD provides [two custom hooks](https://docs.launchdarkly.com/sdk/client-side/react/react-web#hooks); `useFlags` and `useLDClient`. Let's see what they do.

```js
// WeekPicker.js
...
import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk'
...

export default function WeekPicker() {
...
  const flags = useFlags()
  const ldClient = useLDClient()

  console.log('here are the flags:', flags)
  console.log('here is ldClient:', ldClient)
...
}
```

We can utilize `useFlags` to get all feature flags, and `useLDClient` to get access to the LD React SDK client / `LDProvider`.

![image-20220318075748822](/Users/murat/Library/Application Support/typora-user-images/image-20220318075748822.png)

`useFlags` makes a lot of sense, but why would we ever need the whole `useLDClient`? The possibilities are vast but maybe one use case is when rolling out features to a subset of users. Let's add an [optional](https://docs.launchdarkly.com/sdk/client-side/react/react-web#configuring-the-react-sdk) [`user` property](https://docs.launchdarkly.com/sdk/features/user-config#javascript) to `LDProvider`.

> For reference, here is the [full list of LD React SDK / `LDProvider` configurations](https://docs.launchdarkly.com/sdk/client-side/react/react-web#configuring-the-react-sdk).

```js
// index.js
...
const LDProvider = await asyncWithLDProvider({
  clientSideID: '62346a0d87293a1355565b20',

  reactOptions: {
    useCamelCaseFlagKeys: false
  },

  user: {
    key: 'aa0ceb',
    name: 'Grace Hopper',
    email: 'gracehopper@example.com'
  }

...
```

Let's see what we can do with `useLDClient`.

```js
// WeekPicker.js
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";

const flags = useFlags();

// let's see if we can filter the flags by the user
const user = {
  key: "aa0ceb",
  name: "Grace Hopper",
  email: "gracehopper@example.com",
};

console.log("here are flags:", flags);
console.log("here is ldClient:", ldClient);
// new lines
console.log("here is the user", ldClient?.getUser(user));
ldClient?.identify(user).then(console.log);
```

Would you look at that! Looks like we can do plenty with `useLDClient`. Good to know.

![image-20220318082925120](/Users/murat/Library/Application Support/typora-user-images/image-20220318082925120.png)

### Use a boolean variant FF in a component

Let's experiment with the flag. There a few ways we can configure it, let's start simple.

We will turn targeting off, we will leave the final field _If targeting is off, serve \_\_\_\__ as empty. For now we will log the flag, wrap the section of the component with conditional rendering, and navigate to Bookings tab.

```js
// WeekPicker.js

...
import { useFlags } from 'launchdarkly-react-client-sdk'
...

export default function WeekPicker() {
...
  const flags = useFlags()
  console.log(flags['date-and-week'])
...

return (
  ...
  {/* @featureFlag (date and week) */}

  {flags['date-and-week'] && (
   <p data-cy="week-interval">
    {week?.start?.toDateString()} - {week?.end?.toDateString()}
    </p>
  )}
)
```

We set default value as `false` and turn on the targeting. As expected we get a console of `false` and we do not see the `p` getting rendered.

![image-20220318092330884](/Users/murat/Library/Application Support/typora-user-images/image-20220318092330884.png)

And when switching the default value to serve `true`, we get `true`with a visible `p`. Brilliant!

![image-20220318092724890](/Users/murat/Library/Application Support/typora-user-images/image-20220318092724890.png)

If we turned off Targeting, we would get `null` for the flag value, and `p` would not render.

![image-20220318092930658](/Users/murat/Library/Application Support/typora-user-images/image-20220318092930658.png)

The simplest use case then is to keep the default rule as `true` and toggle the targeting.
Since we defined a user property at `LDProvider` we can even make use of that. For now, let's keep things simple and add feature flags everywhere.

![image-20220318093227542](/Users/murat/Library/Application Support/typora-user-images/image-20220318093227542.png)

Before we end the section, we can additionally refactor the code a bit. The below is our preferred convention, prefixing a custom local variable with `FF_` making flag features easy to search later.

```js
// WeekPicker.js

...
// use destructuring to assign the FF to a camelCased local variable
const { 'date-and-week': FF_dateAndWeek } = useFlags()

...

// use the variable
// (instead of the clunky object property reference in array format)
{FF_dateAndWeek && (
  <p data-cy="week-interval">
   {week?.start?.toDateString()} - {week?.end?.toDateString()}
  </p>

```

```javascript
///// the clunky object property reference in array format - Do not prefer ////
...

const flags = useFlags()

...

{flags['date-and-week'] && (
  <p data-cy="week-interval">
   {week?.start?.toDateString()} - {week?.end?.toDateString()}
 </p>
)}
```

### Use a number or string variant FF in a component

The next example is perfect for demoing what can be done beyond a boolean on/off flag.

On Users page we have `Previous` and `Next` buttons for switching the currently selected user. We can think of four possible states these two buttons would be in (2^2).

| Previous | Next |
| -------- | ---- |
| off      | off  |
| off      | on   |
| on       | off  |
| on       | on   |

![image-20220322070112079](/Users/murat/Library/Application Support/typora-user-images/image-20220322070112079.png)

There are 4 flag variations in LD; boolean, string, number and Json. We could use Json or string too, but since the states represent a binary 4 let's use number for now. We can configure that like below.

![image-20220322071048075](/Users/murat/Library/Application Support/typora-user-images/image-20220322071048075.png)

![image-20220322071741336](/Users/murat/Library/Application Support/typora-user-images/image-20220322071741336.png)

In the component we import the hook and assign the flag to a variable. Then in the return we can use any kind of conditional rendering logic. 0 means both are off, 3 means both are on. 1 means only Next button, 2 means only Previous button. This way we can represent the 4 possible states of the two buttons as a number FF.

```js
// UsersList.js

import { useFlags } from 'launchdarkly-react-client-sdk'
...

const {'next-prev': FF_nextPrev } = useFlags()

...

return(

...

// remember the table
// | Previous | Next |
// |----------|------|
// | off      | off  | 0
// | off      | on   | 1
// | on       | off  | 2
// | on       | on   | 3

     {(FF_nextPrev === 2 || FF_nextPrev === 3) && (
          <button
            className="btn"
            onClick={selectPrevious}
            autoFocus
            data-cy="prev-btn"
          >
            <FaArrowLeft /> <span>Previous</span>
          </button>
        )}

        {(FF_nextPrev === 1 || FF_nextPrev === 3) && (
          <button
            className="btn"
            onClick={selectNext}
            autoFocus
            data-cy="next-btn"
          >
            <FaArrowRight /> <span>Next</span>
          </button>
        )}

)
```

![number_FF](/Users/murat/Documents/number_FF.gif)

We keep Targeting on and switch the Default rule. If we turn Targeting off, we turn off both buttons.

![image-20220322073411451](/Users/murat/Library/Application Support/typora-user-images/image-20220322073411451.png)

For reference, here is how we would configure a string version of the same flag.

![image-20220322080442877](/Users/murat/Library/Application Support/typora-user-images/image-20220322080442877.png)

And this is how we would use the string FF:

```js
{
  (FF_nextPrev === "on off" || FF_nextPrev === "on on") && (
    <button
      className="btn"
      onClick={selectPrevious}
      autoFocus
      data-cy="prev-btn"
    >
      <FaArrowLeft /> <span>Previous</span>
    </button>
  );
}

{
  (FF_nextPrev === "off on" || FF_nextPrev === "on on") && (
    <button className="btn" onClick={selectNext} autoFocus data-cy="next-btn">
      <FaArrowRight /> <span>Next</span>
    </button>
  );
}
```

### Use a boolean variant FF to wrap an effect

The app has a slide show feature on Bookables page; it scans through the Bookables continuously every few seconds, and also has a stop button. This feature could be for a kiosk mode, for example. We want to remove the stop button and stop the presentation when the flag is off.

The boolean flag setup is the same simple config as before. Here is how the app will behave with this flag:

![slide show FF](/Users/murat/Documents/slide show FF.gif)

The noteworthy part of this flag is that it wraps the effect conditionally. Remember, we do not want any conditionals wrapping hooks, we want that logic inside the hook. Here is the initial version of the code:

```js
const timerRef = useRef(null)

const stopPresentation = () => clearInterval(timerRef.current)

useEffect(() => {
  timerRef.current = setInterval(() => nextBookable(), 3000)

  return stopPresentation
}, [nextBookable])

...

return(

...

<button
  className="items-list-nav btn"
  data-cy="stop-btn"
  onClick={stopPresentation}
  >
    <FaStop />
    <span>Stop</span>
</button>

...

)
```

Here is the flag setup:

```js
import { useFlags } from 'launchdarkly-react-client-sdk'
...

const { 'slide-show': FF_slideShow } = useFlags()

...

// the same
const timerRef = useRef(null)
// the same
const stopPresentation = () => clearInterval(timerRef.current)

// useEffect with feature flag (the noteworthy part)
useEffect(() => {
  if (FF_slideShow) {
    timerRef.current = setInterval(() => nextBookable(), 1000)
  }

  return stopPresentation
}, [nextBookable, FF_slideShow])

...

return(

...
// familiar usage

{FF_slideShow && (
   <button
   className="items-list-nav btn"
   data-cy="stop-btn"
   onClick={stopPresentation}
  >
  <FaStop />
  <span>Stop</span>
  </button>
)}

...
)
```

### Use a Json variant FF for complex logic

The Json variant might look intimidating at first, but it is what sets LD apart enabling to represent complex logic in a simple way. On the Users page we set the Previous and Next buttons as a number or string variant, declaring that the 4 possible states of the 2 buttons (2^2) can map to the flag configuration either way. On the Bookables page there is the same functionality with the 2 buttons, and we can use the Json variant in a slick manner. Check this configuration:

![image-20220322090306713](/Users/murat/Library/Application Support/typora-user-images/image-20220322090306713.png)

At a high level the flag looks the same in the LD interface.

![image-20220322090627297](/Users/murat/Library/Application Support/typora-user-images/image-20220322090627297.png)

In the UI it works the same as a number or string FF variant.

![prev-next-Booking](/Users/murat/Documents/prev-next-Booking.gif)

The neat factor is in the implementation details:

```js
// BookablesList.js

....

const {
  'slide-show': FF_slideShow,
  'prev-next-bookable': FF_prevNextBookable // our new flag
} = useFlags()

...

return(
...

// much simpler to implement the FF this way vs map to numbers / states
{FF_prevNextBookable.Previous === true && (
 <button
    className="btn"
    onClick={previousBookable}
    autoFocus
    data-cy="prev-btn"
   >
   <FaArrowLeft />
   <span>Prev</span>
  </button>
)}

{FF_prevNextBookable.Next === true && (
  <button
   className="btn"
   onClick={nextBookable}
    autoFocus
    data-cy="next-btn"
 >
    <FaArrowRight />
    <span>Next</span>
 </button>
)}

...
)
```

One could further image possibilities with Json variant; for example we could configure the 4 features for previous, next, slide show and stop in an over-engineered way. Better applications of the Json variant would be an example like the above, or when testing a deployed service and providing many possible flags altogether through a Json variant FF.

## Test LD FFs with Cypress

Testing the application, its feature flags, the deployments of the app, combinations of it all may seem intimidating at first, but it can be simplified. At unit/component test level things are simple; stub the FF. For e2e, Often teams may disable tests on an environment with/without FFs, because it is just a different application at that point. How can we expect an app to pass the same tests on dev and stage if the FF are different.

We can treat e2e testing FF like UI login; test the FF once with due diligence and stub it everywhere else.

### Stubbing a feature flag

[In the repo](https://github.com/muratkeremozcan/react-hooks-in-action-with-cypress) let's try out an e2e test that focuses on next and previous buttons for bookables . These features are related to the feature flag `prev-next-bookable`.

```js
// cypress/integration/ui-integration/bookables-list.spec.js`

describe('Bookables', () => {
  before(() => {
    // ui-(component)integration test,
    // the network does not matter for these features
    cy.stubNetwork()
    cy.visit('/bookables')
    cy.url().should('contain', '/bookables')
    cy.get('.bookables-page')
  })

  // note that cy.intercept() needs to be applied
  // independently per it block,
  // as well as on initial load above
  // because we are hitting the network there too
  beforeEach(() => cy.stubNetwork())
  const defaultIndex = 0

  ...

  // @FF_prevNextBookable
  context('Previous and Next buttons', () => {
    it('should switch to the previous bookable and cycle', () => {
      cy.getByCy('bookables-list').within(() => {
        cy.getByCyLike('list-item').eq(defaultIndex).click()

        cy.getByCy('prev-btn').click()
        cy.checkBtnColor(defaultIndex + 3, 'rgb(23, 63, 95)')
        cy.checkBtnColor(defaultIndex, 'rgb(255, 255, 255)')

        cy.getByCy('prev-btn').click().click().click()
        cy.checkBtnColor(defaultIndex, 'rgb(23, 63, 95)')
      })
    })

    it('should switch to the next bookable and cycle', () => {
      cy.getByCy('bookables-list').within(() => {
        cy.getByCyLike('list-item').eq(defaultIndex).click()

        cy.getByCy('next-btn').click().click().click()
        cy.checkBtnColor(defaultIndex + 3, 'rgb(23, 63, 95)')

        cy.getByCy('next-btn').click()
        cy.checkBtnColor(defaultIndex, 'rgb(23, 63, 95)')
        cy.checkBtnColor(defaultIndex + 1, 'rgb(255, 255, 255)')
      })
    })
  })

  ...
})
```

When running the spec, we immediately notice a few LD calls. Any component will LD FFs will have these.

![image-20220323070823804](/Users/murat/Library/Application Support/typora-user-images/image-20220323070823804.png)

We can use [cy.intercept](https://docs.cypress.io/api/commands/intercept) api to spy or stub any network request or response.

#### Stub the api calls to the LD events endpoint

Let's look at the post request going out to the events endpoint. Our app is not doing much with it.

![image-20220323073330074](/Users/murat/Library/Application Support/typora-user-images/image-20220323073330074.png)

We can stub any post request going out to that url to return an empty response body. The status does not even matter. We use a regex for the url because usual minify approach with `**/events.launchdarkly` would try to stub out our baseUrl and be inaccurate.

```js
before(() => {
  cy.stubNetwork()
  cy.intercept(
    { method: 'POST', hostname: /.*events.launchdarkly.com/ },
    { body: {} }
  ).as('LDEvents')
  cy.visit()
```

Notice the stubbed post call:

![image-20220323074207739](/Users/murat/Library/Application Support/typora-user-images/image-20220323074207739.png)

#### Stub the push updates from LaunchDarkly (EventSource)

Before tackling the next call, let's talk about `cy.intercept`'s `req.reply()`.

Per [the docs](https://docs.cypress.io/api/commands/intercept#Ending-the-response-with-res-send) you can supply a `StaticResponse` to Cypress in 3 ways:

- `cy.intercept()` with [`an argument`](https://docs.cypress.io/api/commands/intercept#staticResponse-lt-code-gtStaticResponselt-code-gt): to stub a response to a route; `cy.intercept('/url', staticResponse)`
- [`req.reply()`](https://docs.cypress.io/api/commands/intercept#Providing-a-stub-response-with-req-reply): to stub a response from a request handler; `req.reply(staticResponse)`
- [`req.continue()`](https://docs.cypress.io/api/commands/intercept#Controlling-the-outbound-request-with-req-continue): to stub a response from a request handler, while letting the request continue to the destination server; `req.continue(res => {..} )`
- [`res.send()`](https://docs.cypress.io/api/commands/intercept#Ending-the-response-with-res-send): to stub a response from a response handler; `res.send(staticResponse)`

That means we can use `req.reply()` to turn off the push updates from LD, because `req.reply()` let's us access the request handler and stub a response.

```js
cy.stubNetwork();

cy.intercept(
  { method: "POST", hostname: /.*events.launchdarkly.com/ },
  { body: {} }
).as("LDEvents");

// turn off push updates from LaunchDarkly (EventSource)
cy.intercept(
  { method: "GET", hostname: /.*clientstream.launchdarkly.com/ },
  // access the request handler and stub a response
  (req) =>
    req.reply("data: no streaming feature flag data here\n\n", {
      "content-type": "text/event-stream; charset=utf-8",
    })
).as("LDClientStream");
```

This is how the network looks at this point:

![image-20220323075909304](/Users/murat/Library/Application Support/typora-user-images/image-20220323075909304.png)

#### Stub our custom FeatureFlags into the app

The most interesting network call is the one going out to LD itself. In the response we can see all our FFs.

> Mind that once a flag is defined, we cannot change the key and we can only change the name. Looking at the network response makes us wish we followed a convention; `kebab-case-<component name>` would be a good one.

![image-20220323081112515](/Users/murat/Library/Application Support/typora-user-images/image-20220323081112515.png)

Let's intercept it and see that response in another form. `req.reply` can be used to intercept the data; here we are intercepting any GET requests to `app.launchdarkly.com` and just logging it out.

```js
cy.intercept({ method: "GET", hostname: /.*app.launchdarkly.com/ }, (req) =>
  req.reply((data) => {
    console.log(data);
  })
);
```

![image-20220323091356637](/Users/murat/Library/Application Support/typora-user-images/image-20220323091356637.png)

The interesting part is the body property. Let's destructure it:

```js
cy.intercept({ method: "GET", hostname: /.*app.launchdarkly.com/ }, (req) =>
  req.reply(({ body }) => {
    console.log(body);
  })
);
```

It is our feature flags, the exact same thing we saw on the browser's Network tab!

![image-20220323091744361](/Users/murat/Library/Application Support/typora-user-images/image-20220323091744361.png)

All right then, let's over-simplify this. Let's say that the custom feature flag object we want is this:

```js
const featureFlags = {
  "prev-next-bookable": { Next: false, Previous: true },
  "slide-show": false,
};
```

If we took `{body}` -the real network response we just logged out- replaced the keys and values with what we want above, that would be a perfect feature flag stub.

> We can iterate through an object with lodash map (lodash is built into Cypress).

Here is the approach:

- Iterate through our desired FF object `featureFlags`
- Take the real response `body` as a table sample
- Declare our desired `featureFlags` keys into the table: `body[ffKey]`
- Assign our desired `featureFlags` values into the table `body[ffKey] = { value: ffValue }`
- Build our stubbed `body` and return it

```js
cy.intercept({ method: "GET", hostname: /.*app.launchdarkly.com/ }, (req) =>
  req.reply(({ body }) =>
    Cypress._.map(featureFlags, (ffValue, ffKey) => {
      body[ffKey] = { value: ffValue };
      return body;
    })
  )
).as("LDApp");
```

Let's wrap all that in a command which you can copy and use anywhere.

```js
Cypress.Commands.add("stubFeatureFlags", (featureFlags) => {
  // ignore api calls to events endpoint
  cy.intercept(
    { method: "POST", hostname: /.*events.launchdarkly.com/ },
    { body: {} }
  ).as("LDEvents");

  // turn off push updates from LaunchDarkly (EventSource)
  cy.intercept(
    { method: "GET", hostname: /.*clientstream.launchdarkly.com/ },
    // access the request handler and stub a response
    (req) =>
      req.reply("data: no streaming feature flag data here\n\n", {
        "content-type": "text/event-stream; charset=utf-8",
      })
  ).as("LDClientStream");

  /** Stubs the FF with the specification
   * Iterate through our desired FF object `featureFlags`
   * Take the real response `body` as a table sample
   * Declare our desired `featureFlags` keys into the table: `body[ffKey]`
   * Assign our desired `featureFlags` values into the table `body[ffKey] = { value: ffValue }`
   * Build our stubbed `body` and return it
   */
  return cy
    .intercept({ method: "GET", hostname: /.*app.launchdarkly.com/ }, (req) =>
      req.reply(({ body }) =>
        Cypress._.map(featureFlags, (ffValue, ffKey) => {
          body[ffKey] = { value: ffValue };
          return body;
        })
      )
    )
    .as("LDApp");
});
```

Let's try it out in our spec. Toggle the booleans to see it in action

```js
// cypress/integration/ui-integration/bookables-list.spec.js`

describe('Bookables', () => {
  const allStubs = () => {
    cy.stubNetwork()
    return cy.stubFeatureFlags({
      'prev-next-bookable': { Next: true, Previous: true },
      'slide-show': true
    })
  }

  before(() => {
    allStubs()

    cy.visit('/bookables')
    cy.url().should('contain', '/bookables')
    cy.get('.bookables-page')
  })

  beforeEach(allStubs)

  const defaultIndex = 0

  ...

  // @FF_prevNextBookable
  context('Previous and Next buttons', () => {
    it('should switch to the previous bookable and cycle', () => {
      cy.getByCy('bookables-list').within(() => {
        cy.getByCyLike('list-item').eq(defaultIndex).click()

        cy.getByCy('prev-btn').click()
        cy.checkBtnColor(defaultIndex + 3, 'rgb(23, 63, 95)')
        cy.checkBtnColor(defaultIndex, 'rgb(255, 255, 255)')

        cy.getByCy('prev-btn').click().click().click()
        cy.checkBtnColor(defaultIndex, 'rgb(23, 63, 95)')
      })
    })

    it('should switch to the next bookable and cycle', () => {
      cy.getByCy('bookables-list').within(() => {
        cy.getByCyLike('list-item').eq(defaultIndex).click()

        cy.getByCy('next-btn').click().click().click()
        cy.checkBtnColor(defaultIndex + 3, 'rgb(23, 63, 95)')

        cy.getByCy('next-btn').click()
        cy.checkBtnColor(defaultIndex, 'rgb(23, 63, 95)')
        cy.checkBtnColor(defaultIndex + 1, 'rgb(255, 255, 255)')
      })
    })
  })

  ...
})
```

> You might want to disable the assertions because they will fail as you are removing the features.

![cy.stubFeatureFlags](/Users/murat/Documents/cy.stubFeatureFlags.gif)

> The inspiration for the command is from [Tim Kutnick](https://medium.com/@kutnickclose?source=post_page-----897349b7f976-----------------------------------) who authored this [medium post](https://medium.com/@kutnickclose/how-to-use-cypress-with-launchdarkly-897349b7f976).

#### How to use the stubs

While playing around with the spec you might have noticed that there are really 8 versions of the app (2^3 with the 3 booleans). Should we extract the feature flag relevant tests into its own spec and test the varieties? Sounds like a fun idea. Let's theory-craft.

| slide-show | prev-btn | next-btn |
| ---------- | -------- | -------- |
| OFF        | OFF      | OFF      |
| OFF        | OFF      | ON       |
| OFF        | ON       | OFF      |
| OFF        | ON       | ON       |
| ON         | OFF      | OFF      |
| ON         | OFF      | ON       |
| ON         | ON       | OFF      |
| ON         | ON       | ON       |

With this we would be exhaustively e2e testing all feature flags on this Bookings page.

Here is the [combinatorial approach](https://github.com/NoriSte/ui-testing-best-practices/blob/master/sections/advanced/combinatorial-testing.md) to reduce the exhaustive test suite. Paste combinatorial test (CT) model into the web app [CTWedge](https://foselab.unibg.it/ctwedge/):

```
Model FF_Bookings
 Parameters:
   slideShow : Boolean
   prevBtn:  Boolean
   nextBtn : Boolean

Constraints:
  // we do not want to test all 3 flags off
 # ( slideShow=false AND prevBtn=false <=> nextBtn!=false) #
```

And we get the test suite of 4:
| slide-show | prev-btn | next-btn |
| ---------- | -------- | -------- |
| ON | ON | OFF |
| ON | OFF | OFF |
| OFF | ON | OFF |
| OFF | OFF | ON |

![image-20220323110701716](/Users/murat/Library/Application Support/typora-user-images/image-20220323110701716.png)

Theoretical math and your tax dollars -if you are in the USA- have already proven that [the above suite will find a majority of the bugs](https://cypress.slides.com/cypress-io/siemens-case-study#/16/0/2) that may appear in this scenario. If you need further convincing, you can download the CSV, and upload to [CAMetrics](https://matris.sba-research.org/tools/cametrics/#/metrics/growth/visualization); an online tool to measure and visualize combinatorial coverage.

> Coverage is an assessment for the thoroughness or completeness of testing with respect to a model. Our model can be unit coverage, feature coverage, mutation score, combinatorial coverage, non-functional requirement coverage, anything!

![image-20220323111303833](/Users/murat/Library/Application Support/typora-user-images/image-20220323111303833.png)

If in a time crunch, you could apply risk-based testing and just test the first case plus one more for good measure.

> Always think _"If A works, what are the chances B can fail?"_ . If the answer is _"Low"_, then apply risk-based-testing. In other words, there is a cost to quality; do not over-test and try to get away with minimal testing that gives enough release confidence.

![image-20220323111331205](/Users/murat/Library/Application Support/typora-user-images/image-20220323111331205.png)

> However many tests you have, you can never prove your software is good. But one failing test means your software isn't good enough. Therefore use proven [test methodologies](https://dev.to/muratkeremozcan/mostly-incomplete-list-of-test-methodologies-52no) to gain the highest confidence with the miminal investment.

Does this mean we should opt to test 2-4 varieties of the stubbed feature flags? Not yet. That idea is for the next section, when testing real feature flags. As mentioned before, we can treat e2e testing FFs like UI login; test the FFs with due diligence in isolation and stub it everywhere else. We first took care of the latter, because it is less costly.

**While stubbing feature flags, we want to always test the latest and greatest features while shifting as left as possible.**Here The approach to ui-e2e | ui-integration testing should be the same as a unit test; test the latest and greatest version of the feature, and test it as early as you can.\*\*

You can imagine a few specs stubbing the features to be on and that is fine, until the feature flag is archived.

Before moving on to controlling FFs, we should turn off all the LD flags and execute the e2e suite. Any tests that fail must have depended on real FFs and we should stub them.

```js
// cypress/integration/ui-integration/bookable-details-retainment.spec.js
describe('Bookable details retainment', () => {
  before(() => {
    cy.stubNetwork()
    // this feature only relies on Next button being available
    cy.stubFeatureFlags({
      'prev-next-bookable': { Next: true }
    })
```

> For Cypress component tests, we already should have stubbed the feature flags. The flags work great with a served app, but in a component or unit test, there is no network call to LD; stubbing the hooks is the way to go. Mind that at the time of writing, because of [issue 18552](https://github.com/cypress-io/cypress/issues/18662) stubbing modules isn't working in the component runner. The same thing is ok in the e2e runner. In the sample repo this will be updated with Cypress 10.

### Controlling FFs with cypress-ld-control plugin

My friend Gleb Bahmutov authored an [excellent blog](https://glebbahmutov.com/blog/cypress-and-launchdarkly/) on testing LD with Cypress, there he revealed his new plugin [cypress-ld-control](https://github.com/bahmutov/cypress-ld-control) that abstracts away the complexities with LD flags controls.

#### Plugin setup

1. `yarn add -D cypress-ld-control`.

2. Create an access token at LD, to be used by the tests to access the LD api.

   ![image-20220324071206630](/Users/murat/Documents/image-20220324071206630.png)

3. Create the `.env` file, or `.as-a.ini` if you are using Gleb's package

   The [cypress-ld-control](https://github.com/bahmutov/cypress-ld-control) plugin utilizes [cy.task](https://docs.cypress.io/api/commands/task), which allows node code to execute within Cypress context. Therefore we will not be able to use `cypress.env.json` to store these LD related environment variables locally.

   For our use case any method for accessing `process.env` will do. Gleb showed how to use [as-a](https://github.com/bahmutov/as-a) and make things neat at . We can show a [dotenv](https://www.npmjs.com/package/dotenv) alternative, less neat but will do for a single repo use case. `yarn add -D dotenv` and create a gitignored `.env` file in the root of your project. The idea is exactly the same as `cypress.env.json` file; add values here for local use, gitignore, and store them securely in CI.

   Per convention, we can create a `.env.example` file in the root, and that should communicate to repo users that they need an `.env` file with real values in place of wildcards. Populate the project key and the auth token in the `.env` file .

   ```.env
   LAUNCH_DARKLY_PROJECT_KEY=hooks-in-action
   LAUNCH_DARKLY_AUTH_TOKEN=api-********-****-****-****-************
   ```

   > We get the project key from Projects tab
   >
   > ![image-20220324084052149](/Users/murat/Library/Application Support/typora-user-images/image-20220324084052149.png)

4. Setup the plugins file.

   ```js
   // cypress/plugins/index.js

   // only needed if using dotenv package
   require("dotenv").config();
   // any other imports
   const reactScripts = require("@cypress/react/plugins/react-scripts");
   const cyGrep = require("cypress-grep/src/plugin");
   const codeCoverageTask = require("@cypress/code-coverage/task");
   // cypress-ld-control setup
   const { initLaunchDarklyApiTasks } = require("cypress-ld-control");

   module.exports = (on, config) => {
     // any other needed code (ex: CRA component test setup)
     const injectDevServer =
       config.testingType === "component" ? reactScripts : () => ({});

     const combinedTasks = {
       // add your other Cypress tasks if any
     };

     // if no env vars, don't load the plugin
     if (
       process.env.LAUNCH_DARKLY_PROJECT_KEY &&
       process.env.LAUNCH_DARKLY_AUTH_TOKEN
     ) {
       const ldApiTasks = initLaunchDarklyApiTasks({
         projectKey: process.env.LAUNCH_DARKLY_PROJECT_KEY,
         authToken: process.env.LAUNCH_DARKLY_AUTH_TOKEN,
         environment: "test", // the name of your environment to use
       });
       // copy all LaunchDarkly methods as individual tasks
       Object.assign(combinedTasks, ldApiTasks);
       // set an environment variable for specs to use
       // to check if the LaunchDarkly can be controlled
       config.env.launchDarklyApiAvailable = true;
     } else {
       console.log("Skipping cypress-ld-control plugin");
     }

     // register all tasks with Cypress
     on("task", combinedTasks);

     return Object.assign(
       {},
       config, // make sure to return the updated config object
       codeCoverageTask(on, config),
       injectDevServer(on, config),
       cyGrep
     );
   };
   ```

   > See another example at <https://github.com/bahmutov/cypress-ld-control/blob/main/cypress/plugins/index.js>.
   >
   > Check out the [5 mechanics around cy.task and the plugin file](https://www.youtube.com/watch?v=2HdPreqZhgk&t=279s).

5. If running tests in the CI, set the secrets at the CI provider interface and inject the secrets to the yml setup.

   ```yml
   // .github/workflows/main.yml
   
   ...
   
   - name: Cypress e2e tests 🧪
   	uses: cypress-io/github-action@v3.0.2
     with:
       install: false # a needed job installed already...
       start: yarn dev # concurrently starts ui and api servers
       wait-on: 'http://localhost:3000'
       browser: chrome
   env:
     CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
     LAUNCH_DARKLY_PROJECT_KEY: ${{ secrets.LAUNCH_DARKLY_PROJECT_KEY }}
     LAUNCH_DARKLY_AUTH_TOKEN: ${{ secrets.LAUNCH_DARKLY_AUTH_TOKEN }}
   ```

   ![image-20220327082714355](/Users/murat/Library/Application Support/typora-user-images/image-20220327082714355.png)

#### Plugin in action

We are opinionated that feature flag tests should be isolated in their own folder, this will help with selective testing logic further down the line when considering flags and deployments.

```bash
## cypress/integration

├── integration
    ├── feature-flags
    │   └── bookings.spec.js
    ├── ui-e2e
    │   └── crud-bookable.spec.js
    └── ui-integration
        ├── bookable-details-retainment.spec.js
        ├── bookables-list.spec.js
        ├── direct-nav.spec.js
        ├── routes.spec.js
        └── user-context-retainment.spec.js
```

> Check out [The 32+ ways of selective testing with Cypress](https://dev.to/muratkeremozcan/the-32-ways-of-selective-testing-with-cypress-a-unified-concise-approach-to-selective-testing-in-ci-and-local-machines-1c19).

We can have a concise plugin setup test

```js
// cypress/integration/feature-flags/ff-sanity.spec.js

it("should sanity check the plugin setup", () => {
  expect(Cypress.env("launchDarklyApiAvailable")).to.eq(true);
});
```

[The plugin API](https://github.com/bahmutov/cypress-ld-control#api) provides these functions:

- getFeatureFlags
- getFeatureFlag
- setFeatureFlagForUser
- removeTarget
- removeUserTarget

#### `getFeatureFlag` & `getFeatureFlags`

The idempotent ones should be safe anywhere:

```js
// cypress/integration/feature-flags/ff-sanity.spec.js

it("get flags", () => {
  // get one flag
  cy.task("cypress-ld-control:getFeatureFlag", "prev-next-bookable").then(
    console.log
  );
  // get all flags (in an array)
  cy.task("cypress-ld-control:getFeatureFlags").then(console.log);
});
```

The setup and the plugin api work great. Even this much enables a potential UI app test strategy where we just read and assert the flag states in isolation in a spec like this one, and test the app features via stubbed flags in other specs. Since all calls are idempotent, there would not be any clashes between the specs or the entities executing them.

![image-20220324100218203](/Users/murat/Library/Application Support/typora-user-images/image-20220324100218203.png)

Let's write a test confirming that all our feature flags are being loaded into the app, while showcasing a little bit of the Cypress api.

```js
// cypress/integration/feature-flags/ff-sanity.spec.js

it("should get all flags", () => {
  cy.task("cypress-ld-control:getFeatureFlags")
    .its("items")
    .as("flags")
    .should("have.length", 4);

  // we can get the data once above and alias it
  // then we can refer to it with with @
  cy.get("@flags").its(0).its("key").should("eq", "date-and-week");
  cy.get("@flags").its(1).its("key").should("eq", "next-prev");
  cy.get("@flags").its(2).its("key").should("eq", "slide-show");
  cy.get("@flags").its(3).its("key").should("eq", "prev-next-bookable");

  // or we could refactor the above block of 4 lines like below
  const flags = [
    "date-and-week",
    "next-prev",
    "slide-show",
    "prev-next-bookable",
  ];

  cy.wrap(flags).each((value, index) =>
    cy.get("@flags").its(index).its("key").should("eq", value)
  );
});
```

The most concise, but slightly harder to read version would be as such.

```js
// cypress/integration/feature-flags/ff-sanity.spec.js

it("should get all flags", () => {
  const flags = [
    "date-and-week",
    "next-prev",
    "slide-show",
    "prev-next-bookable",
  ];

  cy.task("cypress-ld-control:getFeatureFlags")
    .its("items")
    .should("have.length", 4)
    .each((value, index, items) =>
      cy.wrap(items[index]).its("key").should("eq", flags[index])
    );
});
```

Note that the most recently added flag is the highest index, and on the LD interface the most recently added flag is on the top by default. It can be sorted by Oldest if that makes things more comfortable.

![image-20220325055541609](/Users/murat/Library/Application Support/typora-user-images/image-20220325055541609.png)

#### Simple boolean flag (`date-and-week`) with `setFeatureFlagForUser` & `removeUserTarget`

Before setting one, let's try to get a simple flag first. `date-and-week` toggles the beginning and the end of the week for a given date. Recall [Use a boolean variant FF in a component](#use-a-boolean-variant-ff-in-a-component).

```js
// cypress/integration/feature-flags/bookings-date-and-week.spec.js

context("Bookings Date and Week", () => {
  before(() => {
    // make sure the page fully loads first
    cy.intercept("GET", "**/bookings*").as("getBookings*");
    cy.visit("/bookings");
    cy.wait("@getBookings*");
  });

  it("should toggle date-and-week", () => {
    cy.task("cypress-ld-control:getFeatureFlag", "slide-show")
      .its("variations")
      // log it out to get a feel
      .then((variations) => {
        Cypress._.map(variations, (variation, i) =>
          cy.log(`${i}: ${variation.value}`)
        );
      })
      .should("have.length", 2)
      // and is an alias for should, should + expect will retry
      // so would then + cy.wrap or its()
      .and((variations) => {
        expect(variations[0].value).to.eq(true);
        expect(variations[1].value).to.eq(false);
      });
  });
});
```

So far, so good.

![image-20220325063311276](/Users/murat/Library/Application Support/typora-user-images/image-20220325063311276.png)

The the [API for `setFeatureFlagForUser`](https://github.com/bahmutov/cypress-ld-control#setfeatureflagforuser) requires that _the feature flag must have "Targeting: on" for user-level targeting to work._ Recall [Connect the app with LD section](#connect-the-app-with-ld) section, we added a user at that time, and now it can be useful.

```js
// src/index.js
  ...

  const LDProvider = await asyncWithLDProvider({
    clientSideID: '62346a0d87293a1355565b20',
    // we do not want the React SDK to change flag keys to camel case
    // https://docs.launchdarkly.com/sdk/client-side/react/react-web#flag-keys
    reactOptions: {
      useCamelCaseFlagKeys: false
    },
    // https://docs.launchdarkly.com/sdk/client-side/react/react-web#configuring-the-react-sdk
    user: {
      key: 'aa0ceb',
      name: 'Grace Hopper',
      email: 'gracehopper@example.com'
    }
  })

  ...
```

Let's utilize the user key to test out `setFeatureFlagForUser`

```js
// cypress/integration/feature-flags/bookings-date-and-week.spec.js

it("should toggle date-and-week", () => {
  const featureFlagKey = "date-and-week";
  const userId = "aa0ceb";

  cy.task("cypress-ld-control:getFeatureFlag", featureFlagKey)
    .its("variations")
    .then((variations) => {
      Cypress._.map(variations, (variation, i) =>
        cy.log(`${i}: ${variation.value}`)
      );
    })
    .should("have.length", 2)
    .and((variations) => {
      expect(variations[0].value).to.eq(true);
      expect(variations[1].value).to.eq(false);
    });

  cy.log("**variation 0: True**");
  cy.task("cypress-ld-control:setFeatureFlagForUser", {
    featureFlagKey,
    userId,
    variationIndex: 0,
  });

  cy.getByCy("week-interval").should("be.visible");

  cy.log("**variation 1: False**");
  cy.task("cypress-ld-control:setFeatureFlagForUser", {
    featureFlagKey,
    userId,
    variationIndex: 1,
  });

  cy.getByCy("week-interval").should("not.exist");

  // no clean up!?
});
```

![should toggle date-and-week](/Users/murat/Documents/should toggle date-and-week.gif)

The test works pretty well, but there is a concern at the LD interface; after execution we left the flag there for this user.

![image-20220325083056744](/Users/murat/Library/Application Support/typora-user-images/image-20220325083056744.png)

We should end the test with a clean up so that we do not leave any state behind.

```js
// cypress/integration/feature-flags/bookings-date-and-week.spec.js
...
// add to the end of the it block
// better: add to an after block so that it runs
// even when the test may fail halfway through
cy.task('cypress-ld-control:removeUserTarget', { featureFlagKey, userId })
```

#### Boolean flag `slide-show`

The slide show rotates through the items every 3 seconds and can be stopped. When the flag is on, we want the rotation and the stop button available and fully feature tested. When the flag is off, the stop button should be gone and there should be no rotation. We also do not want to wait 3 seconds per rotation, we can use [`cy.clock`](https://docs.cypress.io/api/commands/clock) and [`cy.tick`](https://docs.cypress.io/api/commands/tick). This much already requires a spec file of its own and we see a pattern; a spec file per page and/or feature flag is not a bad idea,

![image-20220325052854800](/Users/murat/Library/Application Support/typora-user-images/image-20220325052854800.png)

We start with a sanity test for the flag, with an idempotent get call. After the sanity, we want to fully test the feature when the flag is on, and then off. Later when the feature becomes permanent, the flag-on case can be minified into its own spec by removing the FF portions, something to keep in mind for test structure.

```js
// cypress/integration/feature-flags/bookings-slide-show.spec.js

describe("Bookings slide-show", () => {
  const featureFlagKey = "slide-show";
  const userId = "aa0ceb";

  const testBtnColor = (i) =>
    cy
      .getByCy("bookables-list")
      .within(() => cy.checkBtnColor(i, "rgb(23, 63, 95)"));

  // a sanity test per flag is a good idea
  // would be removed when the flag is retired
  it("should get slide-show flags", () => {
    cy.task("cypress-ld-control:getFeatureFlag", featureFlagKey)
      .its("variations")
      .should("have.length", 2)
      .and((variations) => {
        expect(variations[0].value).to.eq(true);
        expect(variations[1].value).to.eq(false);
      });
  });

  context("Flag on off", () => {
    // the common state needs to happen after setting the flag
    const setupState = () => {
      cy.clock();
      cy.stubNetwork();
      cy.visit("/bookables");
      cy.tick(1000);
      return cy.wait("@userStub").wait("@bookablesStub");
    };

    const initialIndex = 0;

    it("should slide show through and stop the presentation", () => {
      // would be removed when the flag is retired
      cy.log("**variation 0: True**");
      cy.task("cypress-ld-control:setFeatureFlagForUser", {
        featureFlagKey,
        userId,
        variationIndex: 0,
      });

      setupState();

      // rotate through the items
      for (let i = initialIndex; i < 4; i++) {
        testBtnColor(i);
        cy.tick(3000);
      }
      // end up on the initial
      testBtnColor(initialIndex);

      // stop and make sure slide show doesn't go on
      cy.getByCy("stop-btn").click();
      cy.tick(3000).tick(3000);
      testBtnColor(0);
    });

    // the it block would be removed when the flag is retired
    it("should not show stop button or rotate bookables on a timer", () => {
      cy.log("**variation 1: False**");
      cy.task("cypress-ld-control:setFeatureFlagForUser", {
        featureFlagKey,
        userId,
        variationIndex: 1,
      });
      setupState();

      // no slide show or stop button
      cy.getByCy("stop-btn").should("not.exist");
      cy.tick(3000).tick(3000);
      testBtnColor(initialIndex);
    });

    // we need to clean up the flag after the tests
    // would be removed when the flag is retired
    after(() =>
      cy.task("cypress-ld-control:removeUserTarget", {
        featureFlagKey,
        userId,
      })
    );
  });
});
```

#### Json flag `prev-next`

This flag toggles the four states of Previous and Next buttons. Similar to the `slide-show`, it applies to both Bookings and Bookables pages. That is realistic because LD FFs control React components, and in turn those components may be used on multiple pages. When testing FFs, we already stub the flag and test the at component level. For e2e we can choose any page in which that component is used on. Unless there are extereme edge cases (which we cannot think about) it should be ok not to test the same flag on multiple pages.

> Always think _"If A works, what are the chances B can fail?"_ . If the answer is _"Low"_, then apply **risk-based-testing**. In other words, there is a cost to quality; do not over-test and try to get away with minimal testing that gives enough release confidence.

Let's start with a sanity test; we want to get the flags and make sure they match the config we expect.

```js
// cypress/integration/feature-flags/bookables-prev-next.spec.js

describe("Bookables prev-next-bookable", () => {
  before(() => {
    cy.intercept("GET", "**/bookables").as("bookables");
    cy.visit("/bookables");
    cy.wait("@bookables").wait("@bookables");
  });

  const featureFlagKey = "prev-next-bookable";
  const userId = "aa0ceb";

  it("should get prev-next-bookable flags", () => {
    cy.task("cypress-ld-control:getFeatureFlag", featureFlagKey)
      .its("variations")
      .should("have.length", 4);
  });
});
```

Checking the data, the part we are interested is tha `value` property for each one of the flags.

![image-20220327063924837](/Users/murat/Library/Application Support/typora-user-images/image-20220327063924837.png)

This FF is a Json variant, therefore we will not be able to use a simple check like `expect(variations[0].value).to.eq(something)`. Time to shape the data:

```js
cy.task("cypress-ld-control:getFeatureFlag", featureFlagKey)
  .its("variations")
  .should("have.length", 4)
  .and((variations) => {
    console.log(Cypress._.map(variations, (variation) => variation.value));
  });
```

That yields a neat array of 4 objects; exactly what we need:

![image-20220327064341007](/Users/murat/Library/Application Support/typora-user-images/image-20220327064341007.png)

Here is one way we can assert it:

```js
const expectedFFs = [
  {
    Next: false,
    Previous: false,
  },
  {
    Next: true,
    Previous: false,
  },
  {
    Next: false,
    Previous: true,
  },
  {
    Next: true,
    Previous: true,
  },
];

it("should get prev-next-bookable flags v1", () => {
  cy.task("cypress-ld-control:getFeatureFlag", featureFlagKey)
    .its("variations")
    .should("have.length", expectedFFs.length)
    .and((variations) => {
      const values = Cypress._.map(variations, (variation) => variation.value);
      expect(values).to.deep.eq(expectedFFs);
    });
});
```

Here are 3 neater ways without variable assignments, showcasing TDD vs BDD assertions and [cy-spok](https://github.com/bahmutov/cy-spok):

```js
import spok from 'cy-spok'

...
it('should get prev-next-bookable flags v2', () => {
  cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
    .its('variations')
    .should('have.length', expectedFFs.length)
    .then((variations) =>
          Cypress._.map(variations, (variation) => variation.value)
         )
    // with TDD syntax, using should instead of then will ensure retry ability
    .should((values) => expect(values).to.deep.eq(expectedFFs))
    // alternatively we can use the BDD syntax, also with retry ability
    .then((values) => cy.wrap(values).should('deep.eq', expectedFFs))
    // much concise version using cy-spok
    .should(spok(expectedFFs))
})
```

We can even take it further up a notch by using another toy from Gleb; [cypress-should-really](https://github.com/bahmutov/cypress-should-really);

> [cypress-should-really](https://github.com/bahmutov/cypress-should-really) is a functional helper for Cypress, capable of a lot more than this simple usage.

```js
/// <reference types="cypress" />
import spok from 'cy-spok'
import { map } from 'cypress-should-really'

...

it('should get prev-next-bookable flags v3 (favorite)', () => {
  cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
    .its('variations')
    .should('have.length', expectedFFs.length)
    .then(map('value'))
    .should(spok(expectedFFs))
})
```

All that is left is to test the flag variations. As usual, we control the flag, verify the UI and clean up the flag at the end.

```js
context("flag variations", () => {
  const flagVariation = (variationIndex) =>
    cy.task("cypress-ld-control:setFeatureFlagForUser", {
      featureFlagKey,
      userId,
      variationIndex,
    });

  it("should toggle the flag to off off", () => {
    flagVariation(0);

    cy.getByCy("prev-btn").should("not.exist");
    cy.getByCy("next-btn").should("not.exist");
  });

  it("should toggle the flag to off on", () => {
    flagVariation(1);

    cy.getByCy("prev-btn").should("not.exist");
    cy.getByCy("next-btn").should("be.visible");
  });

  it("should toggle the flag to on off", () => {
    flagVariation(2);

    cy.getByCy("prev-btn").should("be.visible");
    cy.getByCy("next-btn").should("not.exist");
  });

  it("should toggle the flag to on on", () => {
    flagVariation(3);

    cy.getByCy("prev-btn").should("be.visible");
    cy.getByCy("next-btn").should("be.visible");
  });

  after(() =>
    cy.task("cypress-ld-control:removeUserTarget", {
      featureFlagKey,
      userId,
    })
  );
});
```

#### Numeric flag nex-prev

This is a similar functionality to the previous; Previous and Next buttons, effecting different components, and this time a numeric FF variant vs Json. The data is much simpler; values 0 through 3 vs an array of objects as in the Json variant.

![image-20220327074757713](/Users/murat/Library/Application Support/typora-user-images/image-20220327074757713.png)

We can use the same assertion apporach

```js
// cypress/integration/feature-flags/users-next-prev.spec.js

import spok from "cy-spok";
import { map } from "cypress-should-really";

describe("Users nex-prev", () => {
  before(() => {
    cy.intercept("GET", "**/users").as("users");
    cy.visit("/users");
    cy.wait("@users").wait("@users");
  });

  const featureFlagKey = "next-prev";
  const userId = "aa0ceb";
  const expectedFFs = Cypress._.range(0, 4); // [0, 1, 2, 3]

  it("should get prev-next-user flags", () => {
    cy.task("cypress-ld-control:getFeatureFlag", featureFlagKey)
      .its("variations")
      .should("have.length", 4)
      .then(map("value"))
      .should(spok(expectedFFs));
  });
});
```

At this point, we can wrap the `cypress-ld-control` `cy.task`functions in helpers. Mind that `cy.task` cannot be included in a Cypress command, but a function is always fine.

```js
export const setFlagVariation = (featureFlagKey, userId, variationIndex) =>
  cy.task('cypress-ld-control:setFeatureFlagForUser', {
    featureFlagKey,
    userId,
    variationIndex
  })

export const removeUserTarget = (featureFlagKey, userId) =>
  cy.task('cypress-ld-control:removeUserTarget', {
    featureFlagKey,
    userId
  })

/** Can be used for clearing multiple user targets */
export const removeTarget = (featureFlagKey, targetIndex = 0) =>
  cy.task('cypress-ld-control:removeTarget', {
    featureFlagKey,
    targetIndex
  })
```

This part of the test is very similar to the previous feature.

```js
context("flag variations", () => {
  // we get the 2nd and 3rd args from the file
  // and shorten things...
  const flagVariation = (variation) =>
    setFlagVariation(featureFlagKey, userId, variation);

  it("should toggle the flag to off off", () => {
    flagVariation(0);

    cy.getByCy("prev-btn").should("not.exist");
    cy.getByCy("next-btn").should("not.exist");
  });

  it("should toggle the flag to off on", () => {
    flagVariation(1);

    cy.getByCy("prev-btn").should("not.exist");
    cy.getByCy("next-btn").should("be.visible");
  });

  it("should toggle the flag to on off", () => {
    flagVariation(2);

    cy.getByCy("prev-btn").should("be.visible");
    cy.getByCy("next-btn").should("not.exist");
  });

  it("should toggle the flag to on on", () => {
    flagVariation(3);

    cy.getByCy("prev-btn").should("be.visible");
    cy.getByCy("next-btn").should("be.visible");
  });

  after(() => removeUserTarget(featureFlagKey, userId));
  
  // we could also use removeTarget()
  // which is like a deleteAll in case we have multiple users
  // mind that it will impact other tests that are concurrently running
  // after(() => removeTarget(featureFlagKey))
});
```

## Managing FF state with concurrent tests

Shared mutable state is the root of all evil. What woud happen if a test was being concurrently executed by different entities?

Here is a killer way to qualify your tests for statelessness:

1. Wrap the it block (could be describe block too) with `Cypress._.times` (or use [cypress-grep](https://github.com/cypress-io/cypress-grep))
2. Start the app (*in this case the api and the app on one tab with `yarn dev`)*
3. On a second tab start Cypress *(`yarn cy:open`)*, have a browser selected.
4. On a third tab start Cypress again well, but select a different browser.
5. (Optional) repeat 4

### The tests are stateful

Let's have a look at one of the tests again. They are all in the same format after all.

```js
// cypress/integration/feature-flags/bookings-date-and-week.spec.js

describe("Bookings date-and-week", () => {
  before(() => {
    cy.intercept("GET", "**/bookables").as("bookables");
    cy.visit("/bookings");
    cy.wait("@bookables");
  });

  Cypress._.times(10, () => {
    it("should toggle date-and-week", () => {
      const featureFlagKey = "date-and-week";
      const userId = "aa0ceb";

      cy.task("cypress-ld-control:getFeatureFlag", featureFlagKey)
        .its("variations")
        .then((variations) => {
          Cypress._.map(variations, (variation, i) =>
            cy.log(`${i}: ${variation.value}`)
          );
        })
        .should("have.length", 2)
        .and((variations) => {
          expect(variations[0].value).to.eq(true);
          expect(variations[1].value).to.eq(false);
        });

      cy.log("**variation 0: True**");
      cy.task("cypress-ld-control:setFeatureFlagForUser", {
        featureFlagKey,
        userId,
        variationIndex: 0,
      });

      cy.getByCy("week-interval").should("be.visible");

      cy.log("**variation 1: False**");
      cy.task("cypress-ld-control:setFeatureFlagForUser", {
        featureFlagKey,
        userId,
        variationIndex: 1,
      });

      cy.getByCy("week-interval").should("not.exist");

      cy.task("cypress-ld-control:removeUserTarget", {
        featureFlagKey,
        userId,
      });
    });
  });
});
```

Although the test is extremely stable -it is 10x repeatable- when multiple entities are executing it, they clash because there is a shared mutable state between them on LD side.

![concurrency-clash](/Users/murat/Documents/concurrency-clash.gif)

### Randomization can help statefulness

One way to address tests that have to be stateful -for example testing hardware- is to make the spec a semaphore; ensure only one entity can execute the test at a time. This means we probably would not run it on feature branches (we can use`ignoreTestFiles` in Cypress config file for local), and have some CI logic that allows only one master to run at a time. Still, the engineers would need to take care not to execute the test concurrently on a deployment while the matching CI pipeline is running.

> For the record, the below is a Definition of Done for tests that will scale anywhere in the world. It can apply to any kind of testing and is particularly easier to achieve on lower level tests such as unit tests.
>
> Test Definition of Done
>
> * no flake
> * no hard waits/sleeps
> * stateless, multiple entities can execute - cron job or semaphore where not possible
>
> * no order dependency; each _it/describe/context_ block can run with .only in isolation
>
> * tests handle their own state and clean up after themselves - deleted or de-activated entities
>
> * tests live near the source code
>
> * shifted left, as possible - begins with local server, sandbox, or ephemeral instance, works throughout deployments
>
> * low/minimal maintenance; no repeated test code, utilizes risk-based-testing
>
> * enough testing per feature to give us release confidence
>
> * execution evidence in CI
>
> * some visibility, as in a test report

The proper solution to tests sharing state would be randomization. Unless we are locked to *real* hardware (virtual hardware is worth the investment) we can randomize anything. We saw an example of this in the blog post about [email testing](https://dev.to/muratkeremozcan/test-emails-effortlessly-with-cypress-mailosaur-and-cy-spok-56lm) , under the section _Achieving Stateless tests with unique emails_. With [mailosaur](https://mailosaur.com/)  `any-name@unique-serverId.mailosaur.io` went to that unique email server inbox, and we differentiated between the emails by the randomized name.

 In LD context we have similar entities; **project key** -similar to email serverId- and **user key** -similar to the randomized `any-name` section of the email. For project key recall section 4 under [Controlling FFs with cypress-ld-control plugin](#controlling-ffs-with-cypress-ld-control-plugin). For user key recall [Connect the app with LD section](#connect-the-app-with-ld). We have the the project key taken care of but how do we randomize the user key?

### Randomizing the LD user key

 Per [LD docs](https://docs.launchdarkly.com/sdk/features/user-config#javascript) we either specify a user to target (which we have setup as Grace Hopper with key `aa0ceb` until now) or we can set an `anonymous: true` property so that LD creates randomized users and stored that user in local storage.

```js
// src/index.js

...

;(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: '62346a0d87293a1355565b20',
    // we do not want the React SDK to change flag keys to camel case
    // https://docs.launchdarkly.com/sdk/client-side/react/react-web#flag-keys
    reactOptions: {
      useCamelCaseFlagKeys: false
    },
    // https://docs.launchdarkly.com/sdk/client-side/react/react-web#configuring-the-react-sdk
    user: {
      // key: 'aa0ceb',
      // name: 'Grace Hopper',
      // email: 'gracehopper@example.com'

      // to create an anonymous user you can specify the "anonymous" property 
      // and omit the "key" property. 
      // In doing so, the LaunchDarkly client
      // auto-generates a unique identifier for this user.
      // The identifier is saved in local storage and reused in future
      // browser sessions to ensure a constant experience.
      anonymous: true
    }
  })

```

![set-anonymous-true](/Users/murat/Documents/set-anonymous-true.gif)

In the beginning of the test, if we can get that value from local storage, we will have solved one part of the puzzle.
Install and setup the [cypress-localstorage-commands](https://github.com/javierbrea/cypress-localstorage-commands) plugin. 

`yarn add -D cypress-localstorage-commands`

```javascript
// cypress/support/index.js
import "cypress-localstorage-commands"
```

At first it may not be obvious from `cypress-ld-control` [api docs](https://github.com/bahmutov/cypress-ld-control#api) , but `setFeatureFlagForUser` takes a `userId` argument and **creates that userId if it does not exist**. Until now we kept is simple and used `const userId = 'aa0ceb'` in every spec, which points to the already existing LD user. If we instead use an arbitrary string, that key will appear on the LD Targeting tab.

![arbitrary-user-key](/Users/murat/Documents/arbitrary-user-key.gif)

We have 3 facts down

1. We can  have an anonymous user per browser  and the user's id gets stored in local storage.
2. We can access local storage via [cypress-localstorage-commands](https://github.com/javierbrea/cypress-localstorage-commands).
3. We can use [cypress-ld-control](https://github.com/bahmutov/cypress-ld-control#api) to set and remove new keys/Ids.

All we have to do is access local storage, make a variable assignment, and use that variable throughout the test. Cypress clears local storage between tests, so we will automatically have stateless executions with unique flags.


There are [multiple ways to handle variable assignments in a test](https://www.youtube.com/watch?v=VUx-Ztkbtaw) and the below is our favorite. Let's refactor the `date-and-week` spec accordingly.

```js
// cypress/integration/feature-flags/bookings-date-and-week.spec.js

import {
  randomKey,
  setFlagVariation,
  removeUserTarget
} from '../../support/ff-helper'

describe('Bookings date-and-week', () => {
  before(() => {
    cy.intercept('GET', '**/bookables').as('bookables')
    cy.visit('/bookings')
    cy.wait('@bookables')
  })

  it('should toggle date-and-week', () => {
    const featureFlagKey = 'date-and-week'
	  // use the random key for instead of the existing user
    const userId = randomKey()

    cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
      .its('variations')
      .then((variations) => {
        Cypress._.map(variations, (variation, i) =>
          cy.log(`${i}: ${variation.value}`)
        )
      })
      .should('have.length', 2)
      .and((variations) => {
        expect(variations[0].value).to.eq(true)
        expect(variations[1].value).to.eq(false)
      })

    cy.log('**variation 0: True**')
    setFlagVariation(featureFlagKey, userId, 0)
    cy.getByCy('week-interval').should('be.visible')

    cy.log('**variation 1: False**')
    setFlagVariation(featureFlagKey, userId, 1)
    cy.getByCy('week-interval').should('not.exist')
  })
	
  // comment out to see the userId populated on LD side
  after(() => removeUserTarget(featureFlagKey, userId))
})

```

![stateless-executions](/Users/murat/Documents/stateless-executions.gif)

> Our initial concurrency test will pass with this setup, unless you have a trial account and get blocked by [rate limiting (429, Too many requests)](https://apidocs.launchdarkly.com/#section/Overview/Rate-limiting).

### Handling multiple `it` blocks

Cypress clears local storage between tests - `it` blocks - and LD sets a random user in local storage. This works great when a spec file has a single it block, but what happens when there are multiple it blocks? We can handle that with [cypress-localstorage-commands](https://github.com/javierbrea/cypress-localstorage-commands) as well.

There are only a few things we have to do:

1. Like before, get the anonymous user id from local storage, assign it to a variable (ex: `userId`) and make it available throughout the tests.
2. Before each it block, restore a snapshot of the whole local storage. Any name will do for the snapshot identifier, we can even use the unique `userId` we get from local storage.
3. After each it block, save a snapshot of the whole local storage. Again, `userId` variable will be fine.

```js
// cypress/integration/feature-flags/bookables-prev-next.spec.js

import { setFlagVariation, removeUserTarget } from '../../support/ff-helper'

describe('Bookables prev-next-bookable', () => {
  /* expectedFFs are not impacted */
  const featureFlagKey = 'prev-next-bookable'
  // the variable will be available throughout the spec
  let userId

  before(() => {
    cy.intercept('GET', '**/bookables').as('bookables')
    cy.visit('/bookables')
    cy.wait('@bookables').wait('@bookables')

    // assign the variable in the beginning
    cy.getLocalStorage('ld:$anonUserId').then((id) => (userId = id))
  })

  // restore & save localStorage commands restore & take a snapshot
  // we can name that snapshot anything
  // therefore we can use the unique userId for it without issues
  beforeEach(() => cy.restoreLocalStorage([userId]))
  afterEach(() => cy.saveLocalStorage([userId]))

  context('flag sanity', () => {
		/* not impacted */
  })

  context('flag variations', () => {
    it('should toggle the flag to off off', () => {
      setFlagVariation(featureFlagKey, userId, 0)

      cy.getByCy('prev-btn').should('not.exist')
      cy.getByCy('next-btn').should('not.exist')
    })

    it('should toggle the flag to off on', () => {
      setFlagVariation(featureFlagKey, userId, 1)

      cy.getByCy('prev-btn').should('not.exist')
      cy.getByCy('next-btn').should('be.visible')
    })

    it('should toggle the flag to on off', () => {
      setFlagVariation(featureFlagKey, userId, 2)

      cy.getByCy('prev-btn').should('be.visible')
      cy.getByCy('next-btn').should('not.exist')
    })

    it('should toggle the flag to on on', () => {
      setFlagVariation(featureFlagKey, userId, 3)

      cy.getByCy('prev-btn').should('be.visible')
      cy.getByCy('next-btn').should('be.visible')
    })
  })

  after(() => removeUserTarget(featureFlagKey, userId))
})

```

Here is the key refactor from `slide-show` spec. The main idea is that LD only sets the local storage after having visited the page, therefore we have to arrange our test hooks accordingly. Here are the relevant parts of the spec:

```js
// cypress/integration/feature-flags/bookings-slide-show.spec.js

context('Flag on off', () => {
  const initialIndex = 0
  let userId

  beforeEach(() => {
    // nothing to store the first time, 
    // we need it for subsequent tests
    cy.restoreLocalStorage([userId])

    // setting up state for the test
    cy.clock()
    cy.stubNetwork()
    cy.visit('/bookables')
    cy.tick(1000)
    cy.wait('@userStub').wait('@bookablesStub')

    // assign the variable and use it throughout the spec
    cy.getLocalStorage('ld:$anonUserId').then((id) => (userId = id))
  })

  afterEach(() => cy.saveLocalStorage([userId]))

  it('should slide show through and stop the presentation', () => {
    setFlagVariation(featureFlagKey, userId, 0)

    for (let i = initialIndex; i < 4; i++) {
      testBtnColor(i)
      cy.tick(3000)
    }
    testBtnColor(initialIndex)

    cy.getByCy('stop-btn').click()
    cy.tick(3000).tick(3000)
    testBtnColor(0)
  })

  it('should not show stop button or rotate bookables on a timer', () => {
    setFlagVariation(featureFlagKey, userId, 1)

    cy.getByCy('stop-btn').should('not.exist')
    cy.tick(3000).tick(3000)
    testBtnColor(initialIndex)
  })

  after(() => removeUserTarget(featureFlagKey, userId))
})
```

Here is the relevant refactor `users-next-prev` spec.

```js
// cypress/integration/feature-flags/users-next-prev.spec.js

  let userId

  before(() => {
    cy.intercept('GET', '**/users').as('users')
    cy.visit('/users')
    cy.wait('@users').wait('@users')

    // assign the variable in the beginning
    cy.getLocalStorage('ld:$anonUserId').then((id) => (userId = id))
  })

  // preserve the local storage between tests
  beforeEach(() => cy.restoreLocalStorage([userId]))
  afterEach(() => cy.saveLocalStorage([userId]))
```



## Test Strategies

flag states in isolation in a spec, and test the app features via stubbed flags in another spec

like uiLogin, shift left, use semaphore:

- a spec per flag
