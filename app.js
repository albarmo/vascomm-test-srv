require('dotenv').config();

const express = require('express');
const cors = require('cors');
const PORT =  process.env.PORT || 8080;
const logger = require('morgan');
const routes = require('./routes');
const errorHandler = require( './middleware/errorHandler' );
const passport = require( 'passport' );
const session =  require('express-session');
const isLoggedIn = require( './middleware/isLoggedIn' );
require( './helpers/oauth' )


const App = express();
App.use(session({ secret: 'cats', resave:false, saveUninitialized:true, cookie:{secure:false} }))
App.use(passport.initialize());
App.use(passport.session());

App.use(logger('dev'));
App.use(cors());

App.use(express.urlencoded({ extended: 'false' }));
App.use(express.json());

App.use(routes);
App.use(errorHandler);

App.get('/', (_req, res) => {
  return res.status(200).json({ status_message: `VascommSRV is running on port ${PORT}` });
} );

App.get('/oauth', (_req, res) => {
  return res.send('<a href="/auth/google">Authenticate With Google<a/>');
} );

App.get('/auth/google',
  passport.authenticate( 'google', { scope: ['email', 'profile'] } )
);

App.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: "/oauth/failure"
  })
);

App.get( '/protected', isLoggedIn, ( _req, res ) =>
{
  console.log(_req)
  return res.send('Success login Oauth');
});

App.get('/oauth/failure', (_req, res) => {
  return res.send('Something Went Wrong!');
});

// Define the static file path
App.use(express.static(__dirname + '/public/uploads'));
App.get('/', function (_req, res) {
  res.sendFile(__dirname + '/index.html');
});

App.listen(PORT, () => {
  console.log(`This Server running on port ${PORT}`);
});

module.exports = App;
