const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms')
const catchAsync = require('../utils/catchAsync');
const { renderHomePage } = require('../controllers');

/* GET home page. */
router.get('/', renderHomePage);

router.get('/play/:id', catchAsync(rooms.showRoom))

module.exports = router;
