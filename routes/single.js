const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/* GET single-player page. */
router.get('/', (req, res, next) => {
  res.render('single/index');
  main().catch(err => console.log(err));

  async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log('DB Connected')
  }
});

router.post('/', (req, res, next) => {
  //check if the room can be created and redirect
  req.flash('success', 'New room created!');
  req.session.data = req.body;
  res.redirect('/play');
});

router.get('/new', (req, res, next) => {
  const available_themes = ['quimica', 'biologia', 'fisica', 'citologia', 'matematica']
  //available_themes depois será dinâmico
  res.render('single/new', {available_themes})
})

module.exports = router;
