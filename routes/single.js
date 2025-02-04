const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms')
const catchAsync = require('../utils/catchAsync');

router.route('/')
.get((req, res, next) => {
  res.render('single/index');
})

.post(catchAsync(rooms.createNewRoom))

router.get('/new', (req, res, next) => {
  res.render('single/new')
})

module.exports = router;
