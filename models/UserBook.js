const bookshelf = require('../config/bookshelf')

const UserBook = bookshelf.Model.extend({
    tableName: 'userBook',
    users: function() {
        return this.belongsTo('User', 'username','username');
    }
    })


module.exports = UserBook
