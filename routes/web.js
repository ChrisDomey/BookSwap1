const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const User = require('../models/User')
const UserBook = require('../models/UserBook')
const Book = require('../models/Book')
const University = require('../models/University')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const passport = require('passport');


const path = require('path')

/* GET home page. */
router.get('/', authenticationMiddleware(), async (req, res) => {
    // const user = await User.where('id', 1).fetch()
    // const username = user.get('username')
    res.render('index', { username: req.user.username })
})

router.get('/register', function (req, res) {
    res.render('register', { title: 'Registration' })
})



function validate(req) {
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 6-15 characters long.').len(6, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('password1', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody("password1", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('password2', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody("password2", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('password2', 'Passwords do not match, please try again.').equals(req.body.password1);
    req.checkBody('username', 'Username can only contain letters, numbers, dots or underscores.').matches(/^[A-Za-z0-9_.-]+$/, 'i');
    return req.validationErrors();
}

router.post('/register', function (req, res) {
    const errors = validate(req);
    if (errors) {
        console.log(JSON.stringify(errors))
        res.render('register', { title: "Registration", errors: errors })
    }
    else {
        const username = req.body.username;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const plainTextPassword = req.body.password1;
        const emailDomain = email.split("@")[1]
        University.byEmailDomain(emailDomain).then(university => {
            const universityID = university.get('universityID')
            new User({ 'username': username }).fetch().then(user => { console.log(user.get('username')), res.render('register', { title: "Registration", dbError: "Username already Exists" }) })
                .catch(err => {
                    new User({ 'email': email }).fetch().then(user => { console.log(user.get('email')), res.render('register', { title: "Registration", dbError: "email already registered" }) })
                        .catch(erro => {
                            bcrypt.hash(plainTextPassword, saltRounds, function (err, hash) {
                                User.create({
                                    username: username, firstName: firstName, lastName: lastName
                                    , email: email, password: hash, universityID: universityID
                                }).then(user => { req.login(user, err => { res.redirect('/') }) })
                                    .catch(error => { console.log("Failed " + error), res.render('register', { title: "Registration", dbError: "Database Error" }) })
                            })
                        })
                })
        }).catch(error => { console.log("Failed " + error), res.render('register', { title: "Registration", dbError: "Your university is not licensed with us" }) })
    }
})

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }
}

router.get('/login', function (req, res) {
    res.render('login', { title: 'Welcome to BookSwap' })
})

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err || !user) { return res.render('login', info); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
})

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/login')
})

router.get('/userbooks/:username', authenticationMiddleware(), function (req, res) {
    User.forge({ username: req.params.username }).fetch({ withRelated: ['myBooks'] })
        .then(user => {
            var userBooks = user.related('myBooks');
            userBooks.fetch({ withRelated: ['book'] })
                .then(userBooks => {
                    res.render('mybooks', { title: "My books", data: userBooks.toJSON() })
                }
                )
        })
})

router.get('/mywishlist', authenticationMiddleware(), function (req, res) {
    const username = req.user.username
    User.forge({ username: username }).fetch({ withRelated: ['myWishlist'] })
        .then(user => {
            var userWishlist = user.related('myWishlist');
            userWishlist.fetch({ withRelated: ['book'] })
                .then(userWishlist => {
                    res.render('mywishlist', { username: username, title: "My wishlist", data: userWishlist.toJSON() })
                }
                )
        })
})

router.get('/postbook', authenticationMiddleware(), function (req, res) {
    res.render('postbook')
})

router.get('/viewresults/:ISBN', authenticationMiddleware(), function (req, res) {
    Book.forge({ ISBN: req.params.ISBN }).fetch({ withRelated: ['userBooks'] })
        .then(book => {
            var userBooks = book.related('userBooks');
            userBooks.fetch({ withRelated: ['user'] })
                .then(userBooks => {
                    res.render('viewresults', { username : req.user.username ,title: "view results", book: book.toJSON() })
                }
                )
        })    
})

router.post('/searchresults', function (req, res, next) {
    if (req.body.search) {
        const searchIfISBN = req.body.search.replace(/-/g, "");
        if (/^\d+$/.test(searchIfISBN)) {
            Book.byISBN(req.body.search).then(book => {
                res.render('searchresults', { books: book.toJSON() })
            })
        }
        else {
            Book.byAuthorOrTitle(req.body.search).then(books => {
                res.render('searchresults', { username : req.user.username, books: books.toJSON() })
            })
        }
    }
    else {
        const university = req.body.university
        const department = req.body.department
        const course = req.body.course
        University.books(university, department, course).then(books => {
            res.render('searchresults', { books: books.toJSON() })
        })
    }
})

router.get('/aboutus', function (req, res) {
    res.render('aboutus', { title: 'About Us' })
})

router.get('/contactus', function (req, res) {
    res.render('contactus', { title: 'Contact Us' })
})

router.get('/faq', function (req, res) {
    res.render('faq', { title: 'FAQ' })
})

router.get('/howitworks', function (req, res) {
    res.render('howitworks', { title: 'How It Works' })
})

router.get('/participatingunis', function (req, res) {
    res.render('participatingunis', { title: 'Participating Universities' })
})

router.get('/t&c', function (req, res) {
    res.render('t&c', { title: 'Terms & Conditions' })
})

module.exports = router
