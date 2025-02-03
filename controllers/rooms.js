const Room = require('../models/room')

module.exports.createNewRoom = async(req, res, next) => {
  console.log('req.body: ', req.body)
  req.session.data = req.body;
  const room = new Room({theme: req.body.theme, owner: req.body.owner})
  await room.save()
  req.flash('success', 'New room created!');
  res.redirect(`/play/${room._id}`);
}