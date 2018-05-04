const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const config = require('./config/app')
const expressValidator = require('express-validator')
const exphbs = require('express-handlebars')
const knexfile = require('./knexfile')
const knex = require('knex')(knexfile)
const User = require('./models/User')
const dateformat = require('dateformat')

if (config.useEnv) require('dotenv-safe').load() // Must load as early as possible

const routes = require('./routes/web')

//Authentication Packages
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express()
const KnexSessionStore = require('connect-session-knex')(session);

const store = new KnexSessionStore({ knex: knex });


// view engine setup
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        bookNumber(a) {
            if (a===1) return "Books"
            return "Book"
        },
        dateConverter(date){
            return dateformat(date,"m.d.yy")
        },
        line(number) {
            if(number > 1) return true
            return false
        },
        toJSON(object) {
            return JSON.stringify(object)
        },
        secondHeader(url){
            return url.includes("searchresults") || url.includes("viewresults")
        },
        availableDate(){
            const a =dateformat(new Date(),"yyyy-mm-dd")
            return a
        },
        eq(a,b){
            return(a===b)
        }
    }
})

app.engine('.hbs', hbs.engine)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.hbs')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    //generate random string
    secret: 'christopherdomey',
    resave: false,
    store: store,
    saveUninitialized: false,
    //cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.isAuthenticated=req.isAuthenticated();
    next();
})

app.use((req,res,next)=>{
    if(req.user){
        app.locals.username = req.user.username
    }
    res.locals.url=req.originalUrl;
    next()
})

app.use('/', routes)

function renderLogin(user, password, done) {
    user.verifyPassword(password, function (result) {
        if (result) {
            done(null, user)
        }
        else {
            done(null, false, { error: 'Username and Password Combination does not match' })
        }
    })
}

passport.use(new LocalStrategy(
    function (username, password, done) {
        const emailRegex = /\S+@\S+\.\S+/;
        if (emailRegex.test(username)) {
            User.byEmail(username)
                .then((user) => {
                    if (user) { renderLogin(user, password, done) }
                    else { return done(null, false,{ error: 'User does not exist' }); }
                }).catch(error => { return done(error, false,{ error: 'Database error' }); })
        }
        else {
            User.forge({ username: username }).fetch()
                .then(user => {
                    if (user) { renderLogin(user, password, done) }
                    else { return done(null, false,{ error: 'User does not exist' }); }
                }).catch(error => { return done(error, false,{ error: 'Database error' }); })
        }
    }
));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
