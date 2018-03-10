
exports.up = function(knex, Promise) {
    return knex.schema.createTable('userBook', function(t) {
        t.increments('userbookID').unsigned().primary();
        t.string('userID').notNull();
        t.foreign('userID').references('user.userID');
        t.string('ISBN').notNull();
        t.foreign('ISBN').references('book.ISBN');
        t.date('dateUploaded').notNull();
        t.string('streetAddress').notNull();
        t.string('city').notNull();
        t.string('state').notNull();
        t.string('zip').notNull();
        t.string('condition').notNull();
        t.string('pictures').notNull();
        t.date('availableDate').notNull();
        t.enum('transaction',['sell','swap']);
        t.enum('flag',['current','expired']);
        t.enum('status',['available','sold','swapped']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('userBook');  
};
