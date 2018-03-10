
exports.up = function(knex, Promise) {
    return knex.schema.createTable('userFlag', function(t) {
        t.string('userID').notNull()
        t.foreign('userID').references('user.userID');
        t.string('suspendedFor').notNull();
        t.dateTime('suspendedFrom').notNull();
        t.dateTime('suspendedTo').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('userFlag');  
};
