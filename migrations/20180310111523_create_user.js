
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user', function(t) {
        t.string('username').primary();
        t.unique('username');
        t.string('firstName').notNull();
        t.string('lastName').notNull();
        t.string('password').notNull();
        t.string('email').notNull();
        t.unique('email');
        t.string('universityID').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user');  
};
