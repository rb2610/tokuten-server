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
      db.runSql.bind(
        db,
        `CREATE TABLE "session"(
          "sid" varchar NOT NULL COLLATE "default",
          "sess" json NOT NULL,
          "expire" timestamp(6) NOT NULL
        )
        WITH(OIDS = FALSE);
        ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;`
      )
    ],
    callback
  );
};

exports.down = (db, callback) => {
  async.series(
    [
      db.dropTable.bind(db, "session")
    ],
    callback
  );
};

exports._meta = {
  version: 1
};
