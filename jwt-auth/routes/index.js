const express = require("express");

const router = express.Router();

const { signin, signout, refresh, getUser } = require("../handlers/authenticate");
const { verifyToken } = require('../middleware/jwtAuth');

router.post('/signin', signin);
router.post('/signout', signout);
router.post('/refresh', refresh)
router.get('/user/:id', verifyToken, getUser)

module.exports = router;
