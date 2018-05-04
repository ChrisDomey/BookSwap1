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
        },
        sell : function(id){
            return this.where({userbookID:id}).save({status:'sold'},{method:'update',patch:'true'})
        },
        swap: function(id){
            return this.where({userbookID:id}).save({status:'swapped'},{method:'update',patch:'true'})
        },
    }
)


module.exports = bookshelf.model('UserBook', UserBook);
