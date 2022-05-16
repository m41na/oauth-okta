const axios = require('axios');
const qs = require('qs');

function requestToken(req, res) {
    const { code } = req.body;

    const queryString = qs.stringify({
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
            res.json(result.data)
        })
        .catch(error => {
            res.status(403).json(error.response?.data.error_description || error.message);
        });
};

function logout(req, res) {
    const id_token = req.headers['id_token'];
    console.log('id_token in request', id_token);
    axios({
        method: 'GET',
        url: `${process.env.issuer}/logout?id_token_hint=${id_token}`
    })
    
    res.json("You have logged out");
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

module.exports = {
    requestToken,
    logout,
    refreshToken,
};
