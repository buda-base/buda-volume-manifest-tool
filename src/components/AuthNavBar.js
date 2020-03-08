import React from 'react'
import {useAuth0} from '../react-auth0-spa'

const AuthNavBar = () => {
    const {
        isAuthenticated,
        loginWithRedirect,
        logout,
        loading,
        user,
    } = useAuth0();

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            {!isAuthenticated && (
                <button onClick={() => loginWithRedirect({})}>Log in</button>
            )}

            {isAuthenticated && (
                <button style={{lineHeight: '15px'}} onClick={() => logout()}>
                    <span style={{fontSize: '12px', verticalAlign: '6px'}}>
                        {user.email}
                    </span>
                    <br/>
                    Log out
                </button>
            )}
        </div>
    )
};

export default AuthNavBar
