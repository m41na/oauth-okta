const { useEffect } = require("react")
const { Redirect } = require("react-router-dom");
import {clearDocumentCookie} from '../state/cookieJar';

const LogoutCallback = () => {

    useEffect(() => {
        clearDocumentCookie();
    }, []);

    return <Redirect to={"/"} />
}

export default LogoutCallback;