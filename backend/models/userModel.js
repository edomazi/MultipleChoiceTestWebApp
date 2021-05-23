var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var userModel = new Schema({
  name : {
    type: String,
    required: true,
  },
  role : {
    type: String,
  },
  email : {
    type: String,
    required: true,
    unique : true,
  },
  password : {
    type: String,
    required: true,
  },
  quizResults : [
    {
      quizName: String,
      quizDifficulty: String,
      percentage: Number,
      date: {
        type: Date,
        default: Date.now,
      }
    }
  ]
});

// generating a hash
userModel.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userModel.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};
// Export the model
module.exports = mongoose.model('User', userModel);
