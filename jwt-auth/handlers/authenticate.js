const jwt = require('jsonwebtoken');
const { createToken, generateKey } = require("../middleware/jwtAuth");
const { users, accessKeys } = require('../service/fake_db');
const generatedKeySize = 64;
const accessTokenTimeout = '30s';

const signin = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && user.password === password) {
    const accessTokenSecret = generateKey(generatedKeySize);
    const accessToken = createToken(user, accessTokenSecret, accessTokenTimeout);
    const refreshTokenSecret = generateKey(generatedKeySize);
    const refreshToken = createToken(user, refreshTokenSecret);
    if (accessToken && refreshToken) {
      accessKeys.add(user.id, accessToken, accessTokenSecret, refreshToken, refreshTokenSecret);
      res.json({ user: user.username, isAdmin: user.isAdmin, accessToken, refreshToken });
    }
    else {
      res.status(500).json("could not create accessToken");
    }
  }
  else {
    res.status(401);
  }
};

const signout = (req, res) => {
  const { accessToken } = req.body;
  if (accessKeys.remove(accessToken)) {
    console.log('access token cleared');
    res.json('You are signout out')
  }
  else {
    res.json('invaid acces token')
  }
};

const refresh = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json("refresh token is missing in the request")
  }
  else {
    const user = users.find(u => u.refreshToken === refreshToken);
    if (!user) {
      return res.status(403).json("user credentials not found")
    }
    else {
      jwt.verify(refreshToken, user.refreshTokenSecret, (err, tokenUser) => {
        if (err) {
          return res.status(403).json("refresh token is not valid")
        }
        console.log(`token user - ${tokenUser}`);
        const accessToken = createToken(user, user.accessTokenSecret, accessTokenTimeout);
        user.accessToken = accessToken;
        return res.json({ accessToken })
      });
    }
  }
}

const getUser = (req, res) => {
  const tokenUser = req.user;
  if (tokenUser) {
    res.json(tokenUser)
  }
  else {
    res.status(404)
  }
}

module.exports = {
  signin,
  signout,
  getUser,
  refresh,
};
