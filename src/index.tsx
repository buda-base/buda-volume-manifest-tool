import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './i18n'
import { Auth0Provider } from './react-auth0-spa'
import config from './auth_config.json'
import history from './utils/history'

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState: { targetUrl: any }) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    {...config.login}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
