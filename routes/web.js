const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const User = require('../models/User')
const UserBook = require('../models/UserBook')
const UserWishlist = require('../models/UserWishlist')
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
    res.render('index')
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
            new User({ 'username': username }).fetch().then(user => { res.render('register', { title: "Registration", dbError: "Username already Exists" }) })
                .catch(err => {
                    new User({ 'email': email }).fetch().then(user => { res.render('register', { title: "Registration", dbError: "email already registered" }) })
                        .catch(erro => {
                            bcrypt.hash(plainTextPassword, saltRounds, function (err, hash) {
                                User.create({
                                    username: username, firstName: firstName, lastName: lastName
                                    , email: email, password: hash, universityID: universityID
                                }).then(user => { req.login(user, err => { res.redirect('/') }) })
                                    .catch(error => { res.render('register', { title: "Registration", dbError: "Database Error" }) })
                            })
                        })
                })
        }).catch(error => { res.render('register', { title: "Registration", dbError: "Your university is not licensed with us" }) })
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
                    res.render('userbooks', { title: "My books", data: userBooks.toJSON() })
                }
                )
        })
})

router.post('/userbooks/:username', authenticationMiddleware(), (req, res) => {
    if (req.body.type == 'sell') {
        UserBook.sell(req.body.userbookID).then(res.redirect('/userbooks/' + req.user.username))
    }
    else if (req.body.type = 'swap') {
        UserBook.swap(req.body.userbookID).then(res.redirect('/userbooks/' + req.user.username))
    }
})

router.get('/mywishlist', authenticationMiddleware(), function (req, res) {
    const username = req.user.username
    User.forge({ username: username }).fetch({ withRelated: ['myWishlist'] })
        .then(user => {
            var userWishlist = user.related('myWishlist');
            userWishlist.fetch({ withRelated: ['book'] })
                .then(userWishlist => {
                    res.render('mywishlist', { title: "My wishlist", data: userWishlist.toJSON() })
                }
                )
        })
})

router.get('/postbook', authenticationMiddleware(), function (req, res) {
    if (req.query.ISBNbook) {
        Book.byISBN(req.query.ISBNbook).then(book => {
            res.render('postbook', { book: book.toJSON() })
        })
    }
    else {
        res.render('postbook')
    }
})

router.post('/postbook', authenticationMiddleware(), function (req, res) {
    const data = {
        username: req.user.username,
        ISBN: req.body.ISBN,
        dateUploaded: new Date(),
        condition: req.body.condition,
        pictures: "no-image-available.jpg",
        availableDate: req.body.availableDate,
        transaction: req.body.transaction,
        flag: "current",
        status: "available"
    }
    UserBook.create(data).then(book => {
        res.redirect('/userbooks/' + req.user.username)
    })
})

router.get('/viewresults/:ISBN', authenticationMiddleware(), function (req, res) {
    Book.forge({ ISBN: req.params.ISBN }).fetch({ withRelated: ['userBooks'] })
        .then(book => {
            var userBooks = book.related('userBooks');
            userBooks.fetch({ withRelated: ['user'] })
                .then(userBooks => {
                    res.render('viewresults', { title: "view results", book: book.toJSON() })
                }
                )
        })
})

router.get('/searchresults', function (req, res, next) {
    if (req.query.search) {
        const searchIfISBN = req.query.search.replace(/-/g, "");
        if (/^\d+$/.test(searchIfISBN)) {
            Book.byISBN(req.query.search).then(book => {
                res.render('searchresults', { search: req.query.search, books: book.toJSON() })
            })
        }
        else {
            Book.byAuthorOrTitle(req.query.search).then(books => {
                res.render('searchresults', { search: req.query.search, books: books.toJSON() })
            })
        }
    }
    else {
        const university = req.query.university
        const department = req.query.department
        const course = req.query.course
        University.search(university, department, course).then(universities => {
            const univ = universities.toJSON()
            var books = {}
            for (var i = 0; i < univ.length; i++) {
                book = univ[i].book
                books[i] = book
            }
            res.render('searchresults', {
                university: req.query.university,
                department: req.query.department,
                course: req.query.course, books: books
            })
        })
    }
})

router.post('/searchresults', function (req, res) {
    UserWishlist.create({ username: req.user.username, ISBN: req.body.Wishlist }).then(body => {
        res.redirect('mywishlist')
    })
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

router.get('/tc', function (req, res) {
    res.render('tc', { title: 'Terms & Conditions' })
})

module.exports = router
