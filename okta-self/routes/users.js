var express = require('express');
var router = express.Router();
var { sessionToken } = require('../middleware/oauth');

/* GET users listing. */
router.get('/profile', sessionToken, function (req, res) {
  const user = req.locals;
  res.render('profile', { title: 'Express', user: { ...user, name: 'Testing user' } });
});

module.exports = router;
