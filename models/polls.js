var mongoose = require('mongoose');


var pollSchema = mongoose.Schema({
  polls: {
    question: String,
    options: [{
        title: String,
        votes: { type: Number, default: 0 }
    }],
    voteUsers: [{
        voteUserId: String,
        voteUserIp: String,
        allreadyVote: { type: String, default: "no"},
    }],
    creationDate: Date,
    userid: String  
  },
});


module.exports = mongoose.model('Poll', pollSchema);
