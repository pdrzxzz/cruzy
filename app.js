const createError = require('http-errors'); //error messages on route not found
const express = require('express'); // server 
const session = require('express-session') //1. to use flash messages 2. to store data between routes 3. to store login info 
const path = require('path'); //normalize paths of differents sos
const cookieParser = require('cookie-parser'); //populate req.cookies with an object keyed by the cookie names.
const flash = require('connect-flash'); //flash messages 
const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require('passport-local')

//Use a classe express.Router para criar manipuladores de rota modulares e montáveis. 
//Uma instância de Router é um middleware e sistema de roteamento completo; por essa razão, ela é frequentemente referida como um “mini-aplicativo”
//https://expressjs.com/pt-br/guide/routing.html
const indexRouter = require('./routes/index');
const singleRouter = require('./routes/single');
const multiRouter = require('./routes/multi');
const userRoutes = require('./routes/users')

const User = require('./models/user') //require user model

//connect to mongo by mongoose
const dbUrl = 'mongodb://127.0.0.1:27017/cruzy'
mongoose.connect(dbUrl)
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("Database connected");
});

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
    cookie: {
      secure: false, // Use "false" para ambientes de desenvolvimento sem HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 1 dia
    }
  }));
  this.use(flash()); //active flash messages

  //debugging middleware
  //it gives us info about every single request on the server
  this.use((req, res, next) => {
    console.log('Middleware Debug: ', {
      method: req.method,
      url: req.url,
      body: req.body,
      reqsessiondata: req.session.data
    });
    next();
  });

   //initialize passport
   this.use(passport.initialize())
   this.use(passport.session()) //use application-level middleware (after session middleware)
   //These 3 User methods below are defined via passport-local-mongoose 
   passport.use(new LocalStrategy(User.authenticate())); // tell passport to use LocalStrategy and the authentication method is on User method
   passport.serializeUser(User.serializeUser()); //how to store the user in the session
   passport.deserializeUser(User.deserializeUser()); //how to unstore the user in the session

  //debbuging

  //middleware that passes res.locals to pug files
  this.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user
    next();
  });
};
//configure app server
app.config();

// set routes
app.use('/', indexRouter);
app.use('/', userRoutes);
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
