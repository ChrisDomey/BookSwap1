
exports.up = function(knex, Promise) {
    return knex.schema.createTable('university', function(t) {
        t.increments('universityID').primary();
        t.string('universityname').notNull();
        t.string('streetAddress').notNull();
        t.string('city').notNull();
        t.string('state').notNull();
        t.string('zip').notNull();
        t.string('phone').notNull();
        t.string('emailDomain').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('university');  
};
