exports.up = function(knex, Promise) {
    return knex.schema.createTable('universityCourse', function(t) {
        t.increments('universityCourseID').primary();
        t.integer('universityID').unsigned().notNull();
        t.foreign('universityID').references('university.universityID');
        t.string('department').notNull();
        t.string('coursename').notNull();
        t.string('coursenumber').notNull();
        t.string('ISBN').notNull();
        t.foreign('ISBN').references('book.ISBN');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('universityCourse');  
};
