const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cruzy' });
});

router.get('/play', function(req, res, next) {
  res.render('play');
});

module.exports = router;
