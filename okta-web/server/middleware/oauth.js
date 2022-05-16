// const OktaJwtVerifier = require('@okta/jwt-verifier')

// const oktaJwtVerifier = new OktaJwtVerifier({
//     issuer: process.env.issuer,
//     clientId: process.env.client_id
// })

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
    retrieveToken
}