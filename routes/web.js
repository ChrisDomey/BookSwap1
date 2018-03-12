const express = require('express')
const router = express.Router()
const expressValidator = require('express-validator')
const User = require('../models/User')

/* GET home page. */
router.get('/', async (req, res) => {
    // const user = await User.where('id', 1).fetch()
    // const username = user.get('username')

    res.render('index', { title: 'Voyager' })
})

router.get('/register',function(req,res){
    res.render('register',{title:'Registration'})
})

router.post('/register',function(req,res){
    req.checkBody('username',"Username can not be empty").notEmpty();
    res.render('register',{title:"REgistration failed"})
})

module.exports = router
