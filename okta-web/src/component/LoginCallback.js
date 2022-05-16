import { useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../state/AppContext';
import { Redirect } from 'react-router-dom';
import {setDocumentCookie} from '../state/cookieJar';

const LoginCallback = (props) => {
    const { auth, onAuthSuccess, setAuthError } = useContext(AppContext);
    const matched = /code=(.*)&state=(.*)/.exec(props.location.search);
    const hostServer = process.env.REACT_APP_EXPRESS_SERVER;

    useEffect(() => {
        if (matched && !auth?.isAuthenticated) {
            axios.post(`${hostServer}/auth/authorization-code/callback`, {
                code: matched[1],
                state: matched[2]
            })
            .then(res => {
                console.log(res.data);
                onAuthSuccess(res.data);
                //set cookie in document
                setDocumentCookie(res.data);
            })
            .catch(err => {
                console.log(err.message);
                setAuthError(err.message);
            })
        }
    }, []);

    return auth?.isAuthenticated && <Redirect to="/" />;
}

export default LoginCallback;