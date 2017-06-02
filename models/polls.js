var mongoose = require('mongoose');


var pollSchema = mongoose.Schema({
  polls: {
    question: String,
    options: [{
        title: String,
        votes: { type: Number, default: 0 }
    }],
    voteUsers: [{
        voteUserId: { type: String, default: "unauthenticate" },
        voteUserIp: String,
        voteUserDate: Date,
    }],
    creationDate: Date,
    userid: String  
  },
});


module.exports = mongoose.model('Poll', pollSchema);
