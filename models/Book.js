const bookshelf = require('../config/bookshelf')

const Book = bookshelf.Model.extend({
    tableName: 'book',
        userBooks:function(){
            return this.belongsTo('UserBook','ISBN','ISBN')
        }
    })


module.exports = Book
