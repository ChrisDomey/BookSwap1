const bookshelf = require('../config/bookshelf')
bookshelf.plugin('registry')

const UserBook = bookshelf.Model.extend({
    tableName: 'userBook',
    user: function () {
        return this.belongsTo('User', 'username', 'username');
    },
    book: function () {
        return this.belongsTo('Book', 'ISBN', 'ISBN');
    }
},
    {
        create: function (data) {
            return this.forge(data).save()
        }
    }
)


module.exports = bookshelf.model('UserBook', UserBook);
