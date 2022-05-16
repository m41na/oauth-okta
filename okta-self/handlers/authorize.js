const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');

const randomState = () => crypto.randomBytes(16).toString('hex');

function requestCode(req, res) {
    const issuer = process.env.issuer;
    const client_id = process.env.client_id;
    const signin_redirect_uri = process.env.signin_redirect_uri;

    const requestUrl = [`${issuer}/oauth2/default/v1/authorize?`,
    `client_id=${client_id}`,
    `&response_type=code`,
    `&scope=openid&`,
    `redirect_uri=${signin_redirect_uri}`,
    `&state=${randomState()}
    `].join("");

    res.redirect(requestUrl)
}

function requestToken(req, res) {
    const originalUrl = req.originalUrl;
    const match = /code=(.*)?&(state=(.*))?/.exec(originalUrl);
    if(!match){
        return res.redirect('/auth/error')
    }

    const code = match[1];

    const queryString = 
    qs.stringify({
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        grant_type: 'authorization_code',
        redirect_uri: process.env.signin_redirect_uri,
        code
    });

    axios({
        method: 'POST',
        url: `${process.env.issuer}/oauth2/default/v1/token`,
        data: queryString,
        headers: {
            'accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    })
        .then(result => {
            const token = JSON.stringify(result.data);
            console.log('access token', token);
            req.session.token = token
            res.redirect('/users/profile');
        })
        .catch(error => {
            console.log(error.response?.data.error_description || error.message);
            res.redirect('/auth/error')
        });
};

function logout(req, res) {
    const user = req.locals;
    console.log('id_token in request', user.id_token);
    // axios({
    //     method: 'GET',
    //     url: `${process.env.issuer}/logout?id_token_hint=${user.id_token}`
    // }).then(() => {
    //     req.session = null; //destroy session
    //     res.clearCookie('connect.sid') // clean up!
    //     res.redirect(process.env.post_logout_redirect_uri)
    // }).catch(err => {
    //     res.status(500).json("Problem logging out")
    // });
    req.session = null;
    res.clearCookie('connect.sid') // clean up!
    res.redirect(process.env.post_logout_redirect_uri)
}

function refreshToken(res, res) {
    const { refreshToken } = req.locals;

    const queryString = qs.stringify({
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        grant_type: 'refresh_token',
        redirect_uri: process.env.signin_redirect_uri,
        scope: process.env.scope,
        refreshToken
    });

    axios({
        method: 'POST',
        url: `${process.env.issuer}/oauth2/default/v1/token`,
        data: queryString,
        headers: {
            'accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    })
        .then(result => {
            const oktaToken = result.data;
            console.log('refreshing token in session...')
            res.session.oktaToken = JSON.stringify(oktaToken);
            res.json(result.data)
        })
        .catch(error => {
            res.status(403).json(error.response?.data.error_description || error.message);
        });
}

function authError(req, res) {
    res.status(500).json("We have a problem");
}

module.exports = {
    requestCode,
    requestToken,
    logout,
    refreshToken,
    authError
};
