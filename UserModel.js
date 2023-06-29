const mongoose = require('mongoose')

const User = mongoose.model('User', {
  username: {
    type: String
  }
})

module.exports = User