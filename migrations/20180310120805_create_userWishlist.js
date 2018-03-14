
exports.up = function(knex, Promise) {
    return knex.schema.createTable('userWishlist', function(t) {
        t.increments('wishlistID').primary();
        t.string('username').notNull()
        t.foreign('username').references('user.username');
        t.string('ISBN').notNull();
        t.foreign('ISBN').references('book.ISBN');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('userWishlist');  
};
