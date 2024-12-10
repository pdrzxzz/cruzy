const express = require('express');
const router = express.Router();

/* GET single-player page. */
router.get('/', (req, res, next) => {
  res.render('single/index');
});

router.post('/', (req, res, next) => {
  req.flash('success', 'New room created!');
  req.session.data = req.body;
  res.redirect('/play');
});

router.get('/new', (req, res, next) => {
  res.render('single/new')
})

module.exports = router;
