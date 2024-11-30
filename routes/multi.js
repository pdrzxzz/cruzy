const express = require('express');
const router = express.Router();

/* GET single-player page. */
router.get('/', function(req, res, next) {
  res.render('multi');
});

module.exports = router;
