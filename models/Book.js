const bookshelf = require('../config/bookshelf')

const Book = bookshelf.Model.extend({
    tableName: 'book',
        userBooks:function(){
            return this.hasMany('UserBook','ISBN')
        }
    })


module.exports = User
