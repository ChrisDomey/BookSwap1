
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user', function(t) {
        t.string('userID').primary();
        t.string('firstName').notNull();
        t.string('lastName').notNull();
        t.binary('password').notNull();
        t.string('email').notNull();
        t.enum('gender',['male','female','NA']);
        t.date('dOB').notNull();
        t.string('streetAddress').notNull();
        t.string('city').notNull();
        t.string('state').notNull();
        t.string('zip').notNull();
        t.string('phone').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user');  
};
