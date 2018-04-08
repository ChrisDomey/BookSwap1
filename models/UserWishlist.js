const bookshelf = require('../config/bookshelf')
const Book = require('../models/Book')
const UserWishlist = bookshelf.Model.extend({
    tableName: 'userWishlist',
    user: function () {
        return this.belongsTo('User', 'username', 'username');
    },
    book: function () {
        return this.hasOne(Book, 'ISBN', 'ISBN');
    }
})


module.exports = UserWishlist
