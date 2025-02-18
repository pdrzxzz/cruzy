const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware')

router.route('/')
.get(
  isLoggedIn,
  catchAsync(rooms.showAllRooms)) //show all your rooms

.post(
  isLoggedIn,
  catchAsync(rooms.createNewRoom)) //create a new room on database and redirect to it

router.route('/new')
.get(
  isLoggedIn,
  rooms.showRoomCreation //render room creation form
)

router.route('/:id')
.delete(
  isLoggedIn,
  catchAsync(rooms.deleteRoom)) //delete a room on database

module.exports = router;
