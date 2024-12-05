const createError = require('http-errors'); //error messages on route not found
const express = require('express'); // server 
const session = require('express-session') //1. to use flash messages 2. to store data between routes 3. to store login info 
const path = require('path'); //normalize paths of differents sos
const cookieParser = require('cookie-parser'); //populate req.cookies with an object keyed by the cookie names.
const flash = require('connect-flash'); //flash messages 

//Use a classe express.Router para criar manipuladores de rota modulares e montáveis. 
//Uma instância de Router é um middleware e sistema de roteamento completo; por essa razão, ela é frequentemente referida como um “mini-aplicativo”
//https://expressjs.com/pt-br/guide/routing.html
const indexRouter = require('./routes/index');
const singleRouter = require('./routes/single');
const multiRouter = require('./routes/multi');

const app = express();

app.config = function () {
  // view engine setup
  this.set('views', path.join(__dirname, 'views')); //tell express that views directory is where we store the displayable stuff
  this.set('view engine', 'pug'); //https://pugjs.org/api/getting-started.html
  this.use(express.json()); //parsing incoming JSON requests 
  this.use(express.static(path.join(__dirname, 'public')));
  this.use(express.urlencoded({ extended: true }));
  this.use(cookieParser()); //populate req.cookies with an object keyed by the cookie names.
  this.use(session({
    secret: 'secret', //this string is meant to be a secret key, that codifies our cookies
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use "false" para ambientes de desenvolvimento sem HTTPS
  }));
  this.use(flash()); //active flash messages

  //debugging middleware
  //it gives us info about every single request on the server
  this.use((req, res, next) => {
    console.log('Middleware Debug: ', {
      method: req.method,
      url: req.url,
      body: req.body,
    });
    next();
  });
  //debbuging

  //middleware that passes res.locals to pug files
  this.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  });
}
//configure app server
app.config()

// set routes
app.use('/', indexRouter);
app.use('/single', singleRouter);
app.use('/multi', multiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
