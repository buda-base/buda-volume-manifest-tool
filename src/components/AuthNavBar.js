

import React from "react";
import { useAuth0 } from "../react-auth0-spa";

const AuthNavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout, loading } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect({})}>Log in</button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
    </div>
  );
};

export default AuthNavBar;