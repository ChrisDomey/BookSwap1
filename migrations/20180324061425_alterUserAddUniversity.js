
exports.up = function (knex, Promise) {
    knex.schema.alterTable('user', function (t) {
        t.foreign('universityID').references('university.universityID');
    })
};

exports.down = function (knex, Promise) {
    knex.schema.alterTable('user', function (t) {
        t.dropForeign('universityID');
    })
};
