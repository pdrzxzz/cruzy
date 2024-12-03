const express = require('express');
const router = express.Router();

/* GET single-player page. */
router.get('/', (req, res, next) => {
  res.render('single/index');
});

router.post('/', (req, res, next) => {
  req.flash('success', 'New room created!');
  res.redirect('/play' + `?theme=${req.body.theme}`);
});

router.get('/new', (req, res, next) => {
  res.render('single/new')
})


module.exports = router;
