const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { users } = require('../service/fake_db');

const generateKey = (size) => {
    return crypto.randomBytes(size).toString('hex');
}

const createToken = (user, key, expiryTimeout) => {
    const payload = { id: user.id, isAdmin: user.isAdmin }
    return (expiryTimeout) ?
        jwt.sign(payload, key, { expiresIn: expiryTimeout })
        :
        jwt.sign(payload, key);
}

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json('access token is missing in the request');
    }
    else {
        const match = authHeader.match(/Bearer (.*)/);
        if (!match) {
            return res.status(401).json("authorization header value is invalid")
        }
        else {
            const accessToken = match[1];
            const { id } = req.params;
            if (!id) {
                return res.status(401).json("User id is missing in request");
            }
            else {
                const user = users.find(u => u.id === parseInt(id));
                if (!user) {
                    return res.status(403).json("user credentials not found");
                }
                else {
                    jwt.verify(accessToken, user.accessTokenSecret, (err, tokenUser) => {
                        if (err) {
                            return res.status(403).json("access token is not valid")
                        }
                        req.user = tokenUser;
                        next();
                    });
                }
            }
        }
    }
}

module.exports = {
    generateKey,
    createToken,
    verifyToken,
}