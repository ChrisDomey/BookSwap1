
exports.up = function(knex, Promise) {
    return knex.schema.createTable('userFlag', function(t) {
        t.string('username').notNull()
        t.foreign('username').references('user.username');
        t.string('suspendedFor').notNull();
        t.dateTime('suspendedFrom').notNull();
        t.dateTime('suspendedTo').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('userFlag');  
};
