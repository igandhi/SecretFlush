var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
	venue: {name: String, id: String},
	username: String,
	message: String,
	date: {type: Date, default: Date.now}	
});

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;
