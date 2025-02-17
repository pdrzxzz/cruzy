const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms')
const catchAsync = require('../utils/catchAsync');
const { renderHomePage } = require('../controllers');
const { isLoggedIn } = require('../middleware')

/* GET home page. */
router.get('/', renderHomePage); //render home page

router.get('/play/:id', 
    isLoggedIn,
    catchAsync(rooms.showRoom)) //render play with room data from req.params.id

module.exports = router;
