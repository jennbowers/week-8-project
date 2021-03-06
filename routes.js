const parseurl = require('parseurl');

// require in controllers
const createController = require('./controllers/create');
const detailController = require('./controllers/detail');
const indexController = require('./controllers/index');
const welcomeController = require('./controllers/welcome');

// passport setup
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  (username, password, done) => {
    Users.findOne({username: username, password: password}).then(function(user) {
      if(!user) {
        console.log('Auth denied');
        return done(null, false);
      } else {
        return done(null, username);
      }
    });
  }
));

// redirects back to login or signup if name is not already stored in session
var backToLogin = function(req, res, next) {
  var pathname = parseurl(req).pathname;
  console.log(req.session.username);
  console.log(pathname);
  if (!req.session.username && (pathname != '/login' || pathname != '/signup')) {
    res.redirect('/');
  } else {
    next();
  }
};



// passport.authenticate('basic', {session: false});
// passport.authenticate('basic', { successRedirect: '/index', failureRedirect: '/' }),

module.exports = (app) => {
  // app.get app.post etc goes in here with controller stuff
  app.get('/api/sanity', welcomeController.sanityTest);

  // ------- welcome page
  // renders welcome page and redirects from / if not logged in
  app.get('/', welcomeController.renderWelcome);
  // logging in, redirects to index if valid user
  app.post('/login', welcomeController.loginWelcome);
  // signing up, auto logs in and redirects to index
  app.post('/signup', welcomeController.signupWelcome);

  // ------- welcome API endpoints
  // renders welcome page API
  app.get('/api/', welcomeController.renderAPIWelcome);
  // logging in API
  app.post('/api/login', welcomeController.loginAPIWelcome);
  // signing up API
  app.post('/api/signup', welcomeController.signupWelcome);

  // ------- index page
  // renders index page
  app.get('/index', backToLogin, indexController.renderIndex);
  // search for snippets in a specific language
  app.post('/language', backToLogin, indexController.searchLanguageIndex);
  // search for snippets with a specific tag
  app.post('/tags', backToLogin, indexController.searchTagsIndex);

  // ------- index API endpoints
  // renders index page API
  app.get('/api/index', passport.authenticate('basic', {session: false}), indexController.renderAPIIndex);
  // search for snippets in a specific language API
  app.post('/api/language', passport.authenticate('basic', {session: false}), indexController.searchAPILanguageIndex);
  // search for snippets with a specific tag API
  app.post('/api/tags', passport.authenticate('basic', {session: false}), indexController.searchAPITagsIndex);

  // ------ create page
  // renders create page
  app.get('/create', backToLogin, createController.renderCreate);
  // adds snippet to database
  app.post('/create', backToLogin, createController.addSnippetCreate);

  // ------ create API endpoints
  // renders create page API
  app.get('/api/create', passport.authenticate('basic', {session: false}), createController.renderAPICreate);
  // adds snippet to database API
  app.post('/api/create', passport.authenticate('basic', {session: false}), createController.addSnippetAPICreate);

  // ------ detail page
  // renders specific snippet
  app.post('/:id', backToLogin, detailController.renderDetail);

  // ------ detail API endpoint
  // renders specific snippet API
  app.post('/api/:id', passport.authenticate('basic', {session: false}), detailController.renderAPIDetail);

};
