const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

  //check if the room can be created and redirect

  //connect to mongo by mongoose
  mongoose.connect('mongodb://127.0.0.1:27017/cruzy')
  .then(() => {
    console.log('db connected')
  })
  .catch ((error) => {
    console.log('db connection error')
  })

  //room schema, (how a room should look like)
  const roomSchema = new mongoose.Schema({
    theme: {
      type: String,
      required: true
    },
    owner: {
      type: String
    }
  });

  const Room = mongoose.model('Room', roomSchema);

/* GET single-player page. */
router.get('/', (req, res, next) => {
  res.render('single/index');
});

router.post('/', (req, res, next) => {
  const room = new Room(req.body) //probably after we are going to use req.session.data here to retrive the logged user to put on room owner
  console.log("ROOM: ", room)
  console.log("ROOM ID: ", room._id)
  room.save();

  req.flash('success', 'New room created!');
  req.session.data = req.body;
  res.redirect(`/play/${room._id}`);
});

router.get('/new', (req, res, next) => {
  const available_themes = ['quimica', 'biologia', 'fisica', 'citologia', 'matematica']
  //available_themes depois será dinâmico
  res.render('single/new', {available_themes})
})

module.exports = router;
