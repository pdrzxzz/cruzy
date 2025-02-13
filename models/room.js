const mongoose = require('mongoose');

//room schema, (how a room should look like)
const roomSchema = new mongoose.Schema({
    theme: {
      type: String,
      required: true
    },
    owner: {
      type: String,
      required: true,
    },
    game: {
      type: Object,
      required: true,
    }
  });
  
  module.exports = mongoose.model('Room', roomSchema);