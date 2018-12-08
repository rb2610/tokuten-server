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
        `ALTER TABLE rounds_players
        DROP CONSTRAINT rounds_players_round_id_fk;`
      ),
      db.runSql.bind(
        db,
        `ALTER TABLE rounds
        DROP CONSTRAINT rounds_pkey;`
      ),
      db.changeColumn.bind(db, "rounds", "time", {
        type: "timestamptz",
        notNull: true,
        primaryKey: true,
        defaultValue: new String("now()")
      }),
      db.addColumn.bind(db, "rounds", "id", {
        type: "int",
        primaryKey: true,
        notNull: true,
        autoIncrement: true
      }),
      db.runSql.bind(
        db,
        `ALTER TABLE rounds
        ADD CONSTRAINT rounds_pkey
        PRIMARY KEY (id);`
      ),
      db.runSql.bind(
        db,
        `ALTER TABLE rounds_players
        DROP CONSTRAINT rounds_players_pkey;`
      ),
      db.removeColumn.bind(db, "rounds_players", "round_time"),
      db.removeColumn.bind(db, "rounds_players", "round_game_id"),
      db.removeColumn.bind(db, "rounds_players", "round_group_id"),
      db.addColumn.bind(db, "rounds_players", "round_id", {
        type: "int",
        primaryKey: true,
        notNull: true,
        foreignKey: {
          name: "rounds_players_round_id_fk",
          table: "rounds",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT"
          },
          mapping: "id"
        }
      }),
      db.runSql.bind(
        db,
        `ALTER TABLE rounds_players
        ADD CONSTRAINT rounds_players_pkey
        PRIMARY KEY (round_id, player_id);`
      )
    ],
    callback
  );
};

exports.down = (db, callback) => {
  async.series(
    [
      db.runSql.bind(
        db,
        `ALTER TABLE rounds_players
        DROP CONSTRAINT rounds_players_pkey;`
      ),
      db.removeColumn.bind(db, "rounds_players", "round_id"),
      db.addColumn.bind(db, "rounds_players", "round_game_id", {
        type: "int",
        notNull: true
      }),
      db.addColumn.bind(db, "rounds_players", "round_group_id", {
        type: "int",
        notNull: true
      }),
      db.addColumn.bind(db, "rounds_players", "round_time", {
        type: "timestamptz",
        primaryKey: true,
        notNull: true
      }),
      db.runSql.bind(
        db,
        `ALTER TABLE rounds_players
        ADD CONSTRAINT rounds_players_pkey
        PRIMARY KEY (round_game_id, round_group_id, round_time, player_id);`
      ),
      db.runSql.bind(
        db,
        `ALTER TABLE rounds
        DROP CONSTRAINT rounds_pkey;`
      ),
      db.removeColumn.bind(db, "rounds", "id"),
      db.changeColumn.bind(db, "rounds", "time", {
        type: "timestamptz",
        notNull: true
      }),
      db.runSql.bind(
        db,
        `ALTER TABLE rounds
        ADD CONSTRAINT rounds_pkey
        PRIMARY KEY (game_id, group_id, time);`
      ),
      db.runSql.bind(
        db,
        `ALTER TABLE rounds_players
        ADD CONSTRAINT rounds_players_round_id_fk
        FOREIGN KEY (round_game_id, round_group_id, round_time)
        REFERENCES rounds (game_id, group_id, time)
        ON DELETE CASCADE
        ON UPDATE RESTRICT;`
      )
    ],
    callback
  );
};

exports._meta = {
  version: 1
};
