const bookshelf = require('../config/bookshelf')

const UserBook = bookshelf.Model.extend({
    tableName: 'userBook',
    })


module.exports = UserBook
