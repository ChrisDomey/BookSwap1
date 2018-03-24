const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const User = require('../models/User')
const UserBook = require('../models/UserBook')
const University = require('../models/University')
const bcrypt = require('bcrypt')
const saltRounds = 10;

/* GET home page. */
router.get('/', async (req, res) => {
    // const user = await User.where('id', 1).fetch()
    // const username = user.get('username')

    res.render('index', { title: 'Voyager' })
})

router.get('/register', function (req, res) {
    res.render('register', { title: 'Registration' })
})

function renderLogin(user, password, res) {
    user.verifyPassword(password, function (result) {
        if (result) {
            res.render('login', { title: 'Successful' })
        }
        else {
            res.render('login', { title: 'Login', error: 'Username and password combination does not match' })
        }
    })
}

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
                                }).then(user => { console.log(`Registered successfully ${user.get('username')}`), res.render('index', { title: "Successful" }) })
                                    .catch(error => { console.log("Failed " + error), res.render('register', { title: "Registration", dbError: "Database Error" }) })
                            })
                        })
                })
        }).catch(error => { console.log("Failed " + error), res.render('register', { title: "Registration", dbError: "Your university is not licensed with us" }) })
    }
})

router.get('/login', function (req, res) {
    res.render('login', { title: 'Login' })
})

router.post('/login', function (req, res) {
    req.checkBody('username').isEmail();
    if (req.validationErrors()) {
        User.forge({ username: req.body.username }).fetch()
            .then(user => {
                renderLogin(user, req.body.password, res)
            }).catch(error => { res.render('login', { title: 'Login', error: 'User not found' }) })
    }
    else {
        User.byEmail(req.body.username)
            .then(user => {
                renderLogin(user, req.body.password, res)
            }).catch(error => { res.render('login', { title: 'Login', error: 'User not found' }) })
    }
})

router.get('/mybooks', function (req, res) {
    User.forge({username: 'krishna'}).fetch({withRelated: ['myBooks']})  
    .then(user=>{
            res.render('mybooks', { title: user.related('myBooks').toJSON()})
    })
})

router.get('/mywishlist', function (req, res) {
    res.render('mywishlist', { title: "mywishlist" })
})


module.exports = router
