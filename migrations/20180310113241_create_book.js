
exports.up = function(knex, Promise) {
    return knex.schema.createTable('book', function(t) {
        t.string('ISBN').primary().notNull();
        t.string('title').notNull();
        t.string('author').notNull();
        t.string('publisher').notNull();
        t.string('edition').notNull();
        t.date('publishDate').notNull();
        t.string('state').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('book');  
};
