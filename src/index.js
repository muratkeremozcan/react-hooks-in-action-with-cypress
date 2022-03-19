import ReactDOM from 'react-dom'
import App from './components/App.js'
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk'

// because we are using await, we have to wrap it all in an async IIFE
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
      key: 'aa0ceb',
      name: 'Grace Hopper',
      email: 'gracehopper@example.com'
    }
  })

  // wrap the app with LDProvider
  return ReactDOM.render(
    <LDProvider>
      <App />
    </LDProvider>,
    document.getElementById('root')
  )
})()
