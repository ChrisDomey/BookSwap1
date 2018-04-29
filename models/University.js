const bookshelf = require('../config/bookshelf')

const University = bookshelf.Model.extend({
    tableName: 'university'
},
    {
        byEmailDomain: function (emailDomain) {
            return this.forge().query({ where: { emailDomain: emailDomain } }).fetch();
        },
        books:function(university,department,course){
            return this.query(function(qb) {
                qb.where({Universityname:university,department:department,coursename:course}).orWhere({Universityname:university,department:department,coursenumber:course});
              }).fetchAll();
        }
    }
)


module.exports = University