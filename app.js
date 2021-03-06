const express = require('express');
const mustache = require('mustache');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./routes');

// mongoose
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const environment = process.env.NODE_ENV || "development";

let mongoURL;
if (environment === "production") {
  mongoURL = process.env.MONGODB_URI;
} else {
  mongoURL = require("./config.json")[environment].mongoURL;
}

mongoose.connect(mongoURL);

// models
const Snippets = require('./models/snippets');
const Users = require('./models/users');

// controllers
const createController = require('./controllers/create');
const detailController = require('./controllers/detail');
const indexController = require('./controllers/index');
const welcomeController = require('./controllers/welcome');

// express
const app = express();

// mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

// views
app.set('views', './views');

// body parser
app.use(bodyParser.json());
app.use((bodyParser.urlencoded({extended: false})));

// session
app.use(session({
  secret: 'Covfefe'
  , resave: false
  , saveUninitialized: false
}));

routes(app);

app.listen(process.env.PORT || 3000, () => {
  console.log('Successfully started express application');
});

module.exports = app;
