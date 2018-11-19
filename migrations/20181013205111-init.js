"use strict";

var async = require("async");

var dbm;
var type;
var seed;

const schemaName = process.env.SCHEMA;
const pgUser = process.env.PGUSER;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = (options, seedLink) => {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = (db, callback) => {
  async.series(
    [
      db.createTable.bind(db, "test", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        name: { type: "string", notNull: true },
        wins: { type: "int", notNull: true, default: 0 },
        played: { type: "int", notNull: true, default: 0 }
      }),
      db.runSql.bind(
        db,
        `GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE
        ON ALL TABLES IN SCHEMA ${schemaName} 
        TO ${pgUser};`
      ),
      db.runSql.bind(
        db,
        `GRANT USAGE, SELECT, UPDATE
        ON SEQUENCE test_id_seq
        TO ${pgUser};`
      ),
      db.insert.bind(db, "test", ["name", "wins", "played"], ["Foo", "5", "8"]),
      db.insert.bind(db, "test", ["name", "wins", "played"], ["Roo", "2", "8"])
    ],
    callback
  );
};

exports.down = db => {
  return db.dropTable("test");
};

exports._meta = {
  version: 1
};
