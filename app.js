'use strict';

const express = require('express'),
      path = require('path'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      Promise = require('bluebird'),
      session = require('express-session'),
      hbs = require('hbs'),
      indexRouter = require('./routes/indexRouter'),
      newsRouter = require('./routes/newsRouter'),
      usersRouter = require('./routes/usersRouter'),
      adminRouter = require('./routes/adminRouter'),
      app = express();

// Use bluebird for mongoose promise library
mongoose.Promise = Promise;

// Establish mongodb connection
mongoose.connect("mongodb://localhost/scraper");
const db = mongoose.connection;

// Log any mongoose errors
db.on('error', error => {
    console.log('Mongoose error: ', error);
});

// Log a connection success message
db.once('open', () => {
    console.log('Mongoose connection established!');
});

app.use(session({
  secret: '1234567',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// view engine setup
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/news', newsRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
