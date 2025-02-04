const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms')
const catchAsync = require('../utils/catchAsync');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Cruzy' });
});

router.get('/play/:id', catchAsync(rooms.showRoom))

module.exports = router;
