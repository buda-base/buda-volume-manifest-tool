import React from 'react'
import history from '../utils/history'
import { useAuth0 } from '../react-auth0-spa'

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
        <div className="ml-4">
            {!isAuthenticated && (
                <button onClick={() => loginWithRedirect(history.location)}>Log in</button>
            )}
            {isAuthenticated && (
                <button style={{lineHeight: '15px'}} onClick={() => logout()}>
                    { user.bdrcID && 
                        <span style={{fontSize: '12px', verticalAlign: '6px'}}>
                            {/* user.email */}
                            { user.bdrcID }
                        </span> }
                    <br/>
                    Log out
                </button>
            )}
        </div>    
    );
};

export default AuthNavBar
