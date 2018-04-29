const bookshelf = require('../config/bookshelf')
const bcrypt = require('bcrypt');
const UserWishlist = require('../models/UserWishlist')
bookshelf.plugin('registry')

const User = bookshelf.Model.extend({
    tableName: 'user',
    verifyPassword: function (password, fn) {
        bcrypt.compare(password, this.get('password'), function (err, result) {
            fn(result)
        })
    },
    myBooks: function () {
        return this.hasMany('UserBook', 'username','username')
    },
    myWishlist: function () {
        return this.hasMany('UserWishlist', 'username','username')
    }
},
    {
        create: function (data) {
            return this.forge(data).save()
        },
        byEmail: function(email){
            return this.forge().query({where:{ email : email }}).fetch();           
        }
    })
    
module.exports = bookshelf.model('User', User);
