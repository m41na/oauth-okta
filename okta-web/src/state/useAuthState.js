import { useState } from 'react';
import axios from 'axios';
import { cookieToJson } from './cookieJar';

const clientId = process.env.REACT_APP_OKTA_CLIENT_ID;
const issuerDomain = process.env.REACT_APP_OKTA_DOMAIN;
const signinRedirectUri = process.env.REACT_APP_OKRA_SIGNIN_REDIRECT;

const randomState = () => (Math.random() + 1).toString(36).substring(2);

const initialState = {
    isAuthenticated: false,
    user: null,
    error: null,
};

const authState = () => {

    const [auth, setAuth] = useState(initialState);

    const setAuthError = (message) => {
        setAuth(state => ({ ...state, error: message }))
    }

    const onAuthSuccess = (user) => {
        setAuth(state => ({ ...state, user, isAuthenticated: true, error: null }))
    }

    const onAuthClear = () => {
        setAuth(state => ({ ...state, user: null, isAuthenticated: false, error: null }))
    }

    const login = () => {
        window.location.href = [`https://${issuerDomain}/oauth2/default/v1/authorize?`,
        `client_id=${clientId}`,
            `&response_type=code`,
            `&scope=openid&`,
        `redirect_uri=${signinRedirectUri}`,
        `&state=${randomState()}
        `].join("")
    };

    const logout = () => {
        const { access_token, id_token } = cookieToJson(document.cookie);
        const hostServer = process.env.REACT_APP_EXPRESS_SERVER;
        axios.get(`${hostServer}/auth/logout`, {
            headers: { 
                authorization: `Bearer ${access_token}`, 
                id_token 
            }
        })
            .then(json => {
                console.log(json.data);
                onAuthClear()
            })
            .then(err => {
                console.log(err.message);
            })
    };

    return { auth, login, logout, onAuthSuccess, setAuthError };
}

export default authState;