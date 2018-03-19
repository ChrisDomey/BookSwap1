const bookshelf = require('../config/bookshelf')
const bcrypt = require('bcrypt');

const User = bookshelf.Model.extend({
    tableName: 'user',
    verifyPassword: function(password){
        return bcrypt.compare(password, this.get('password'),function(err, res) {
        return(res)
    })}},
    {
        create: function(data){
            return this.forge(data).save()
        }
    })

module.exports = User
