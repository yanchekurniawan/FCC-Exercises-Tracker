const mongoose = require('mongoose')

const Exercise = mongoose.model('Exercise', {
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date
  },
  userId: {
    type: mongoose.ObjectId
  }
})

module.exports = Exercise