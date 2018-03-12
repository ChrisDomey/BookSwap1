const bookshelf = require('../config/bookshelf')

const User = bookshelf.Model.extend({
    tableName: 'user'
})

module.exports = User
