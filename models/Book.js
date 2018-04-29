const bookshelf = require('../config/bookshelf')

const Book = bookshelf.Model.extend({
    tableName: 'book',
    userBooks: function () {
        return this.belongsTo('UserBook', 'ISBN', 'ISBN')
    },
    userWishlist: function () {
        return this.belongsTo('UserWishlist', 'ISBN', 'ISBN')
    }
},
    {
        byISBN: function (ISBN) {
            return this.forge().query({ where: { ISBN: ISBN } }).fetch();
        },
        byAuthorOrTitle: function (authorOrTitle) {
            return this.query(function(qb) {
                qb.where('author', 'LIKE', "%"+authorOrTitle+"%").orWhere('title', 'LIKE', "%"+authorOrTitle+"%" );
              }).fetchAll();
        }
    }
)


module.exports = Book
