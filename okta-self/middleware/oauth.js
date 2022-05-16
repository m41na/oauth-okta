const axios = require('axios');
const OktaJwtVerifier = require('@okta/jwt-verifier')

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: `${process.env.issuer}/oauth2/default`,
    clientId: process.env.client_id
})

// const verifyToken = async (req, res, next) => {
//     try {
//         const { authorization } = req.headers

//         if (!authorization) throw new Error('You must send an Authorization header')

//         const [authType, token] = authorization.trim().split(' ')
//         if (authType !== 'Bearer') throw new Error('Expected a Bearer token')

//         const { claims } = await oktaJwtVerifier.verifyAccessToken(token, 'api://default')
//         if (!claims.scp.includes(process.env.scope)) {
//             throw new Error('Could not verify the proper scope')
//         }
//         next()
//     } catch (error) {
//         res.status(403).json(error.message)
//     }
// }

const sessionToken = async (req, res, next) => {
    try {
        const sessionToken = req.session.token;
        if (!sessionToken) throw new Error('You are not authenticated')

        const token = JSON.parse(sessionToken);
        if (!token.access_token) throw new Error('accessToken is missing')

        const { claims } = await oktaJwtVerifier.verifyAccessToken(token.access_token, 'api://default')
        if (!claims.scp.includes(process.env.scope)) {
            throw new Error('Could not verify the proper scope');
        }

        const user = await axios.get(`${process.env.issuer}/oauth2/default/v1/userinfo`,
            {
                headers: {
                    Authorization: `Bearer ${token.access_token}`
                }
            })
            .then(json => json.data)
            .catch(err => {
                throw err;
            });
            
        console.log('user info', user);

        req.locals = token;
        next()
    } catch (error) {
        res.status(403).json(error.message)
    }
}

const retrieveToken = (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization) throw new Error('You must send an Authorization header');

        const [authType, token] = authorization.trim().split(' ')
        if (authType !== 'Bearer') throw new Error('Expected a Bearer token');

        req.accessToken = token;

        console.log('retrieved access token...', token);
        next();
    } catch (error) {
        res.status(403).json(error.message)
    }
}

module.exports = {
    sessionToken,
    retrieveToken
}