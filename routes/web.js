const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const user = require('../models/User')

/* GET home page. */
router.get('/', async (req, res) => {
    // const user = await User.where('id', 1).fetch()
    // const username = user.get('username')

    res.render('index', { title: 'Voyager' })
})

router.get('/register', function (req, res) {
    res.render('register', { title: 'Registration' })
})

router.post('/register', function (req, res) {
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 6-15 characters long.').len(6, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('password1', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody("password1", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('password2', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody("password2", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('password2', 'Passwords do not match, please try again.').equals(req.body.password1);
    req.checkBody('username', 'Username can only contain letters, numbers, dots or underscores.').matches(/^[A-Za-z0-9_.-]+$/, 'i');

    const errors = req.validationErrors();
    if (errors) {
        console.log(JSON.stringify(errors))
        res.render('register', { title: "Registration", errors: errors })
    }
    else {
        const username = req.body.username;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const gender = req.body.gender;
        const dOB = req.body.dOB;
        const streetAddress = req.body.streetAddress;
        const city = req.body.city;
        const state = req.body.state;
        const zip = req.body.zip;
        const phone = req.body.phone;
        const password = req.body.password1;
        console.log("Variables set");

        new user({
            username: username, firstName: firstName, lastName: lastName
            , email: email, gender: gender, dOB: dOB, streetAddress: streetAddress
            , city: city, state: state, zip: zip, phone: phone
            , password: password
        }, function (error) { console.log(JSON.stringify(error)) }).save()
            .then(function () { res.render('/register', { title: "Successful" }) })
            .catch(error => res.render('/register').send(error.message));


    }
})

module.exports = router
