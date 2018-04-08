const bookshelf = require('../config/bookshelf')
const Book = require('../models/Book')
const UserBook = bookshelf.Model.extend({
    tableName: 'userBook',
    user: function() {
        return this.belongsTo('User', 'username','username');
    },
    book:function() {
        return this.hasOne(Book, 'ISBN','ISBN');
    }
    })


module.exports = UserBook
