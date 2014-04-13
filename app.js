var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io');
var mongoose = require('mongoose');
var app = express();
var uristring = 'mongodb://localhost/test';
server = http.createServer(app);
io.listen(server);

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

app.post('/send', function(req, res) {
	var message = new Message(req.body);
	message.save();
	console.log(message);
	res.json(Message.find());
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

server.listen(3000);

module.exports = app;
