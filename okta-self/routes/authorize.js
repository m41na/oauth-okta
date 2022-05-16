const express = require("express");
const router = express.Router();

const { requestCode, requestToken, logout, refreshToken, authError } = require("../handlers/authorize");
const { sessionToken } = require("../middleware/oauth");

router.get('/login', requestCode);

router.get("/authorization-code/callback", requestToken);

router.get("/logout", sessionToken, logout);

router.post("/token", refreshToken);

router.get('/error', authError)

module.exports = router;
