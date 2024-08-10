var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var session = require('express-session');
var session = require('cookie-session');
var cors = require('cors')
require('dotenv').config()
// console.log(process.env)
const mongoose = require('mongoose');
const config = {
    db: 'nodejs'
};

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var apistudent = require('./routes/api-student');
var securedRouter = require('./routes/secured-pages');


var app = express();

var sess = {
  secret: 'keyboard cat',
  cookie: {},
  proxy: true,
  resave: true,
  saveUninitialized: true
}
app.use(session(sess));

const corsOptions = {
  origin: 'http://localhost:3001', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'text', 'field', 'order', 'page', 'limit'], // Allowed headers
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions)); // Use CORS middleware

const dbName = config.db;
const url = 'mongodb://localhost:27017';
const mongoUri = `${url}/${dbName}`;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // keepAlive: true
});

mongoose.connection.on('connected', () => {
  console.log(`Connected to the database: ${dbName}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`Unable to connect to the database: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log(`Disconnected from the database: ${dbName}`);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
      console.log('Mongoose connection disconnected through app termination');
      process.exit(0);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/', indexRouter);
app.get('/crash',(req, res, next)=>{
  process.exit();
  ghghghghgh;
 })

// app.use((req, res, next) => {
//   if (req.session.user != null && typeof (req.session.user) == 'string') {
//     next();
//   } else {
//     res.redirect('/login')
//   }
// })

app.use('/', securedRouter);
app.use('/api/customer', apiRouter);
app.use('/api/student', apistudent);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
