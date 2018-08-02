const mongoose = require('mongoose');

let ExSchema = new mongoose.Schema({
  description: {
      type: String,
      required: true,
      maxlength: [25,'Description should be less than 25 charachters!']
  },
  duration: {
      type: Number,
      required: true,
      min: [1,'Duration too short , one min or over please!']
  },
  date: {
      type: Date,
      default: Date.now
  },
  userId: {
      type: String,
      required: true
  }
});


const Exercise = mongoose.model('Exercise', ExSchema);

module.exports = Exercise;