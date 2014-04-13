var express = require('express');
// var app = module.exports = express.createServer();
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uristring = 'mongodb://localhost/test';
var events = require('events');
// io.listen(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

mongoose.connect(uristring, function(err, res){
	if (err) {
			console.log('ERROR connecting to: ' + uristring + '. ' + err);
		}
	else{
			console.log('Succeeded connected to: ' + uristring);
		}
});

var Message = require('./models/message.js');

var eventEmitter = new events.EventEmitter();
// var trigger = function trigger() {
	io.sockets.on('connection', function(socket) {
		var venueId;
		socket.on('venId', function(data) {
			venueId=data;
		});
		socket.emit('newMes', Message.find({'venue.id':venueId}, 'message'));
	});
// };

// eventEmitter.on('testEm', trigger);
app.post('/send', function(req, res) {
	var message = new Message(req.body);
	message.save(function(err) {
		if (err) {
			res.send(500, 'error');
		} else{
			res.send('success');
			console.log(message);
			// eventEmitter.emit('testEm', message.venue.id);
			res.json(Message.find());
		}
	});
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// server.listen(3000);
app.listen(3000);