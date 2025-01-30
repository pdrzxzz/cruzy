const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Cruzy' });
});

router.get('/play/:id', function (req, res) {
  const id = req.params.id;
  //connect to mongo by mongoose
  mongoose.connect('mongodb://127.0.0.1:27017/cruzy')
  .then(() => {
    console.log('db connected')
  })
  .catch ((error) => {
    console.log('db connection error')
  })

  let { data } = req.session;
  res.render('play', { data });
});

module.exports = router;
