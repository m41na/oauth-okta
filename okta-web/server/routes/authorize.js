const express = require("express");

const router = express.Router();

const { requestToken, logout, refreshToken } = require("../handlers/authorize");
const { retrieveToken } = require("../middleware/oauth");

router.post("/authorization-code/callback", requestToken);

router.get("/logout", retrieveToken, logout);

router.post("/token", refreshToken);

module.exports = router;
