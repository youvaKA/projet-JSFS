var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

//Chargement des routes
const routes = require('./server/routes/index');
const userRouter = require('./server/routes/users');
const ObjectsRouter = require('./server/routes/objects');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));


app.use(routes);
app.use('/user', userRouter);
app.use('/obj', ObjectsRouter);



// catch 404 and forward to error handler
app.use((_,res) => {
  res.redirect('/');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});


module.exports = app;
