
exports.up = function(knex, Promise) {
    return knex.schema.createTable('userWishlist', function(t) {
        t.increments('wishlistID').primary();
        t.string('userID').notNull()
        t.foreign('userID').references('user.userID');
        t.string('ISBN').notNull();
        t.foreign('ISBN').references('book.ISBN');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('userWishlist');  
};
