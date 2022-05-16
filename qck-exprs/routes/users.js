var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('now cookie', req.cookies['now']);
  res.send('respond with all resources');
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  const now = new Date().toISOString();
  res.cookie('now', now, {
    httpOnly: true,
    maxAge: 60*60*5
  });
  console.log("cookie 'now' was set to", now);

  res.send('respond with a single resource');
});

module.exports = router;
