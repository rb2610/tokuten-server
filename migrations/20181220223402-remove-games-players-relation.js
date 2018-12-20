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
  async.series([db.dropTable.bind(db, "games_players")], callback);
};

exports.down = (db, callback) => {
  async.series(
    [
      db.createTable.bind(db, "games_players", {
        game_id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          foreignKey: {
            name: "games_players_game_id_fk",
            table: "games",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT"
            },
            mapping: "id"
          }
        },
        player_id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          foreignKey: {
            name: "games_players_player_id_fk",
            table: "players",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT"
            },
            mapping: "id"
          }
        }
      })
    ],
    callback
  );
};

exports._meta = {
  version: 1
};
