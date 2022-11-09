import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import auth0, { AuthOptions } from 'auth0-js'
import history from './utils/history'

const DEFAULT_REDIRECT_CALLBACK = () =>
    window.history.replaceState({}, document.title, window.location.pathname)

var auth: auth0.WebAuth

export const Auth0Context = React.createContext({})

interface AuthUser {
    user?: any
    loading?: boolean
    isAuthenticated: boolean
    loginWithRedirect: any
    logout: any
}
export const useAuth0 = (): AuthUser => useContext(Auth0Context) as AuthUser

export const Auth0Provider = ({
    children,
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    ...initOptions
}: {
    children: React.ReactElement
    onRedirectCallback: (appState: { targetUrl: any }) => void
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>()
    const [user, setUser] = useState()
    const [auth0Client] = useState()
    const [loading, setLoading] = useState(true)
    const [popupOpen] = useState(false)

    useEffect(() => {
        const initAuth0 = async () => {
            auth = new auth0.WebAuth(initOptions as AuthOptions)
            handleAuthentication()
            getUser()
        }

        initAuth0()
        // eslint-disable-next-line
    }, [])

    const getUser = async () => {
        if (checkAuthenticated()) {
            const token = localStorage.getItem('access_token')
            if (token) {
                // @ts-ignore
                auth.client.userInfo(token, async (
                    err: any,
                    // @ts-ignore
                    profile: {
                        (prevState: undefined): undefined
                        bdrcData?: any
                        bdrcID?: any
                    }
                ) => {
                    if (profile) {
                        const app_token = localStorage.getItem('id_token')
                        const bdu = await axios.get(
                            '//editserv.bdrc.io/resource-nc/user/me',
                            {
                                headers: {
                                    Authorization: 'Bearer ' + app_token,
                                },
                            }
                        )
                        profile.bdrcData = bdu.data
                        profile.bdrcID = Object.keys(bdu.data)
                            .map(k => k.replace(/^.*?[/]([^/]+)$/, 'bdu:$1'))
                            .join()
                        setUser(profile)

                        const isAuthenticated = checkAuthenticated()
                        setIsAuthenticated(isAuthenticated)

                        setLoading(false)

                        console.log('profile', profile)
                    }
                })
            }
        } else {
            setLoading(false)
        }
    }

    const login = (redirect: any) => {
        console.log('redirect', redirect)
        if (redirect)
            localStorage.setItem('auth0_redirect', JSON.stringify(redirect))
        else localStorage.setItem('auth0_redirect', '/')
        auth.authorize()
    }

    const checkAuthenticated = () => {
        // Check whether the current time is past the
        // Access Token's expiry time
        let item = localStorage.getItem('expires_at')
        if (!item) return false
        let expiresAt = JSON.parse(item)
        return new Date().getTime() < expiresAt
    }

    const setSession = async (authResult: auth0.Auth0DecodedHash) => {
        if (authResult.expiresIn) {
          // Set the time that the Access Token will expire at
          let expiresAt = JSON.stringify(
              authResult.expiresIn * 1000 + new Date().getTime()
          )
          localStorage.setItem('bvmt_expires_at', expiresAt)
        }
        if (authResult.accessToken && authResult.idToken) {
          localStorage.setItem('bvmt_access_token', authResult.accessToken)
          localStorage.setItem('bvmt_id_token', authResult.idToken)
        }

        console.log('session', authResult)

        getUser()
    }

    const handleAuthentication = () => {
        auth.parseHash(async (err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                setSession(authResult)
                const redirect_from_localStorage = localStorage.getItem('auth0_redirect')
                if (redirect_from_localStorage) {
                  let redirect = JSON.parse(redirect_from_localStorage)
                  if (redirect) {
                      history.push(redirect)
                      // TODO find something better to force rerendering
                      window.location.reload()
                  }
                }
                else window.history.replaceState(null, "", ' ')
            } else if (err) {
                console.log(err)
            }
        })
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
                // @ts-ignore
                getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
                // @ts-ignore
                loginWithRedirect: (...p) => login(...p),
                // @ts-ignore
                getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
                getTokenWithPopup: (...p: any) =>
                    // @ts-ignore
                    auth0Client.getTokenWithPopup(...p),
                logout: (...p: any) => {
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('id_token')
                    localStorage.removeItem('expires_at')
                    setIsAuthenticated(false)
                },
            }}
        >
            {children}
        </Auth0Context.Provider>
    )
}
