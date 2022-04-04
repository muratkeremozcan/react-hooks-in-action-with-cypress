import ReactDOM from 'react-dom'
import App from './components/App.js'
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk'

// because we are using await, we have to wrap it all in an async IIFE
;(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: '624b26b7a161aa154d1d15dc',
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

  // wrap the app with LDProvider
  return ReactDOM.render(
    <LDProvider>
      <App />
    </LDProvider>,
    document.getElementById('root')
  )

  // with react 18
  // (there are issues with Cypress 9 component test runner with React 18, upgrade react with cy 10)
  /*
  const root = ReactDOM.createRoot(document.getElementById('root'))

  return root.render(
    <LDProvider>
      <App />
    </LDProvider>
  )
  */
})()
