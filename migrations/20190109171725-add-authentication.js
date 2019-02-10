"use strict";

var async = require("async");

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = (db, callback) => {
  async.series(
    [
      db.runSql.bind(db, `CREATE EXTENSION IF NOT EXISTS pgcrypto;`),
      db.addColumn.bind(db, "players", "password", {
        type: "string",
        notNull: true,
        defaultValue: new String("crypt('changeme', gen_salt('bf'))")
      })
    ],
    callback
  );
};

exports.down = (db, callback) => {
  async.series(
    [
      db.removeColumn.bind(db, "players", "password"),
      db.runSql.bind(db, `DROP EXTENSION pgcrypto;`)
    ],
    callback
  );
};

exports._meta = {
  version: 1
};
