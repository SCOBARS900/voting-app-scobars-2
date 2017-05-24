var mongoose = require('mongoose');


var pollSchema = mongoose.Schema({
  polls: {
    question: String,
    options: String,
  },
});


module.exports = mongoose.model('Poll', pollSchema);
