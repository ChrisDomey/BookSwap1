
exports.up = function(knex, Promise) {
    return knex.schema.createTable('userBook', function(t) {
        t.increments('userbookID').primary();
        t.string('username').notNull();
        t.foreign('username').references('user.username');
        t.string('ISBN').notNull();
        t.foreign('ISBN').references('book.ISBN');
        t.date('dateUploaded').notNull();
        t.string('condition').notNull();
        t.string('pictures').notNull();
        t.date('availableDate').notNull();
        t.string('comments')
        t.enum('transaction',['both','sell','swap']);
        t.enum('flag',['current','expired']);
        t.enum('status',['available','sold','swapped']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('userBook');  
};
