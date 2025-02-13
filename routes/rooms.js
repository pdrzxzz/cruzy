const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware')

router.route('/')
.get(
  catchAsync(rooms.showAllRooms))

.post(
  isLoggedIn,
  catchAsync(rooms.createNewRoom))

router.get('/new', isLoggedIn, 
  (req, res, next) => {
  res.render('rooms/new')
})

router.route('/:id')
.delete(
  isLoggedIn,
  catchAsync(rooms.deleteRoom))

module.exports = router;
