//Dependenices
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var querystring = require('querystring');
require('dotenv').config();
  console.log(process.env.TEST);

//Routes
var routes = require('./routes/index');
var spotify = require('./routes/spotify');

//App
var app = express();



// view engine setup
app.use(express.static('public'));
app.set('view engine', 'ejs')

//Middleware --> Runs before any request get/post
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
  .use(cors())
  .use(cookieParser());

app.use('/', routes);
app.use('/spotify', spotify);



//ERROR HANDLING
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});


//Exporting App variable to be used by other files
module.exports = app;
