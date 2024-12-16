const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Cruzy' });
});

router.get('/play', function (req, res) {
  let { data } = req.session;
  res.render('play', { data });
});

module.exports = router;
