import React, { useContext } from 'react';
import { Redirect, Route } from "react-router-dom";
import { AppContext } from '../state/AppContext';

function ProtectedRoute({ component: Component, ...restOfProps }) {

    const { auth } = useContext(AppContext);
    const isAuthenticated = auth.isAuthenticated;
    console.log("this", isAuthenticated);

    return (
        <Route
            {...restOfProps}
            render={(props) =>
                isAuthenticated ? <Component {...props} /> : <Redirect to="/signin" />
            }
        />
    );
}

export default ProtectedRoute;