const bookshelf = require('../config/bookshelf')

const University = bookshelf.Model.extend({
    tableName: 'university',
    book: function () {
        return this.belongsTo('Book', 'ISBN', 'ISBN')
    }
},
    {
        byEmailDomain: function (emailDomain) {
            return this.forge().query({ where: { emailDomain: emailDomain } }).fetch();
        },
        search:function(university,department,course){
            return this.query(function(qb) {
                qb.where({Universityname:university,department:department,coursename:course}).orWhere({Universityname:university,department:department,coursenumber:course});
              }).fetchAll({ withRelated: ['book']} );
        }
    }
)


module.exports = University