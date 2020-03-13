
import React, { useState, useEffect, useContext } from "react";
import axios from 'axios'
//import createAuth0Client from "@auth0/auth0-spa-js";
import auth0 from 'auth0-js';
import history from './utils/history'

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

var auth

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    
    const initAuth0 = async() => {
      auth = new auth0.WebAuth(initOptions)      
      console.log("auth",auth)

      handleAuthentication();
      
      getUser()

    }

    initAuth0();
    // eslint-disable-next-line
  }, []);

  const getUser = async () => {
    if(checkAuthenticated()) {
      const token = localStorage.getItem('access_token')
      if(token) { 
        auth.client.userInfo(token, async (err, profile) => {
          if (profile) {

            const app_token = localStorage.getItem("id_token")            
            const bdu = await axios.get('//editserv.bdrc.io/resource-nc/user/me', { headers: {
              "Authorization": "Bearer " + app_token
            } })
            profile.bdrcData = bdu.data
            profile.bdrcID = Object.keys(bdu.data).map(k => k.replace(/^.*?[/]([^/]+)$/,'bdu:$1')).join()
            setUser(profile)
            
            const isAuthenticated = checkAuthenticated();
            setIsAuthenticated(isAuthenticated);

            setLoading(false);

            console.log("profile",profile)

          }
        })
      }
    }
    else {
      setLoading(false);
    }
  }

  const login = (redirect) => {
     // console.log("auth1",this.auth1,auth0)
    console.log("redirect",redirect)
    if(redirect) localStorage.setItem('auth0_redirect', JSON.stringify(redirect));
    else localStorage.setItem('auth0_redirect', '/');
    auth.authorize();
  }

  const checkAuthenticated = () => {
    // Check whether the current time is past the
    // Access Token's expiry time
    let item = localStorage.getItem('expires_at')
    if(!item) return false;
    let expiresAt = JSON.parse(item);
    return new Date().getTime() < expiresAt;
  }

  const setSession = async (authResult) => {
    // Set the time that the Access Token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    console.log("session",authResult)

    getUser()

  }

  const handleAuthentication = () => {
    auth.parseHash(async (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(authResult);
        let redirect = JSON.parse(localStorage.getItem('auth0_redirect'))
        if(redirect) { 
          history.push(redirect)
          // TODO find something better to force rerendering 
          window.location.reload()
        }
        else window.history.replaceState(null, null, ' ');
        
      } else if (err) {
        console.log(err);
      }
    });
  }

    /*
    const initAuth0 = async () => {
      
      const auth0FromHook = await createAuth0Client(initOptions);

      setAuth0(auth0FromHook);      

      if (window.location.search.includes("code=") &&
          window.location.search.includes("state=")) {
          try {
            const { appState } = await auth0FromHook.handleRedirectCallback();
            onRedirectCallback(appState);
          }
          catch(e) {
            console.error("auth0 error",e)
          }
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
    */
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        // handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => login(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => { 
            localStorage.removeItem('access_token');
            localStorage.removeItem('id_token');
            localStorage.removeItem('expires_at');
            setIsAuthenticated(false);
        }
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};