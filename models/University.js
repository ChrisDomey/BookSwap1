const bookshelf = require('../config/bookshelf')

const University = bookshelf.Model.extend({
    tableName: 'university',
},
    {
        byEmailDomain: function (emailDomain) {
            return this.forge().query({where:{ emailDomain: emailDomain }}).fetch();             
        }
    })


module.exports = University