"use strict";

var async = require("async");

var dbm;
var type;
var seed;

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
        wins: { type: "int", notNull: true, default: 0 }
      }),
      db.insert.bind(db, "test", ["name", "wins"], ["Foo", "5"]),
      db.insert.bind(db, "test", ["name", "wins"], ["Roo", "2"])
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
