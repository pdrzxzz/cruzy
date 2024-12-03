const createError = require('http-errors');
const express = require('express'); // server 
const session = require('express-session')
const path = require('path'); //normalize paths of differents sos
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const indexRouter = require('./routes/index');
const singleRouter = require('./routes/single');
const multiRouter = require('./routes/multi');
const methodOverride = require('method-override');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); //https://pugjs.org/api/getting-started.html
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use "false" para ambientes de desenvolvimento sem HTTPS
}));
app.use(flash());

app.use((req, res, next) => {
  console.log('Middleware Debug: ', {
    method: req.method,
    url: req.url,
    body: req.body,
  });
  next();
});


app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// routes
app.use('/', indexRouter);
app.use('/single', singleRouter);
app.use('/multi', multiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  console.log('Success messages before passing to locals:', req.flash('success')); // Verifica o valor
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
