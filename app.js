//import dependecies
const express = require('express');
const debug = require('debug')('app');
const dotenv = require('dotenv');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

dotenv.config();


const port = process.env.PORT || 8080;

//Import the mongoose module
let mongoose = require('mongoose');

//Set up default mongoose connection
let mongoURI = process.env.DB_URI;
mongoose.connect(mongoURI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true })
  .then (() => { debug('MongoDB connected') })
  .catch(err => { debug('MongoDB connection error: ', err) });

//nav link
const nav = ['Home', 'About', 'Contact', 'FAQ'];

//use static files
app.use(express.static(path.join(__dirname, 'src', 'public')));

//import routes
const UserRoutes = require('./src/routes/UserRoutes')(nav);
const StaticRoutes = require('./src/routes/StaticRoutes')(nav);

//import passport
require('./src/config/passport')();

//body parser
app.use(express.urlencoded({ extended: true }));

//express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

//use routes
app.use('/', StaticRoutes);
app.use('/users', UserRoutes);

//set view engine
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.listen(port, () => {
  debug(`App is running on port ${port}`)
});
