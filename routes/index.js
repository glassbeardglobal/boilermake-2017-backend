var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('views/landing.html', { root: path.join(__dirname, '..')});
});

router.get('/dashboard', function(req, res, next) {
  res.sendfile('views/dashboard.html', { root: path.join(__dirname, '..')});
});

module.exports = router;
