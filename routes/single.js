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
  const available_themes = ['quimica', 'biologia', 'fisica', 'citologia', 'matematica']
  //available_themes depois será dinâmico
  res.render('single/new', {available_themes})
})

module.exports = router;
