const bookshelf = require('../config/bookshelf')

const Book = bookshelf.Model.extend({
    tableName: 'book',
        userBooks:function(){
            return this.belongsTo('UserBook','ISBN','ISBN')
        },
        userWishlist:function(){
            return this.belongsTo('UserWishlist','ISBN','ISBN')
        }
    })


module.exports = Book
