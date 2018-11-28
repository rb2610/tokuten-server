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
        id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          autoIncrement: true
        },
        name: { type: "string", notNull: true },
        wins: { type: "int", notNull: true, default: 0 },
        played: { type: "int", notNull: true, default: 0 }
      }),
      db.createTable.bind(db, "players", {
        id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          autoIncrement: true
        },
        name: { type: "string", notNull: true }
      }),
      db.createTable.bind(db, "groups", {
        id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          autoIncrement: true
        },
        name: { type: "string", notNull: true }
      }),
      db.createTable.bind(db, "games", {
        id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          autoIncrement: true
        },
        name: { type: "string", notNull: true }
      }),
      db.createTable.bind(db, "rounds", {
        game_id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          foreignKey: {
            name: "rounds_game_id_fk",
            table: "games",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT"
            },
            mapping: "id"
          }
        },
        group_id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          foreignKey: {
            name: "rounds_group_id_fk",
            table: "groups",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT"
            },
            mapping: "id"
          }
        },
        time: {
          type: "timestamptz",
          notNull: true,
          primaryKey: true
        }
      }),
      db.createTable.bind(db, "rounds_participants", {
        round_game_id: {
          type: "int",
          primaryKey: true,
          notNull: true
        },
        round_group_id: {
          type: "int",
          primaryKey: true,
          notNull: true
        },
        round_time: {
          type: "timestamptz",
          primaryKey: true,
          notNull: true
        },
        participant_id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          foreignKey: {
            name: "rounds_participants_participant_id_fk",
            table: "players",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT"
            },
            mapping: "id"
          }
        }
      }),
      db.runSql.bind(
        db,
        `ALTER TABLE "rounds_participants"
        ADD CONSTRAINT "rounds_participants_round_id_fk"
        FOREIGN KEY (round_game_id, round_group_id, round_time)
        REFERENCES "rounds" (game_id, group_id, time)
        ON DELETE CASCADE
        ON UPDATE RESTRICT;`
      ),
      db.createTable.bind(db, "rounds_winners", {
        round_game_id: {
          type: "int",
          primaryKey: true,
          notNull: true
        },
        round_group_id: {
          type: "int",
          primaryKey: true,
          notNull: true
        },
        round_time: {
          type: "timestamptz",
          primaryKey: true,
          notNull: true
        },
        winner_id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          foreignKey: {
            name: "rounds_winners_winners_id_fk",
            table: "players",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT"
            },
            mapping: "id"
          }
        }
      }),
      db.runSql.bind(
        db,
        `ALTER TABLE "rounds_winners"
        ADD CONSTRAINT "rounds_winners_round_id_fk"
        FOREIGN KEY (round_game_id, round_group_id, round_time)
        REFERENCES "rounds" (game_id, group_id, time)
        ON DELETE CASCADE
        ON UPDATE RESTRICT;`
      ),
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
      }),
      db.createTable.bind(db, "groups_players", {
        group_id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          foreignKey: {
            name: "groups_players_group_id_fk",
            table: "groups",
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
            name: "groups_players_player_id_fk",
            table: "players",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT"
            },
            mapping: "id"
          }
        }
      }),
      db.createTable.bind(db, "groups_games", {
        group_id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          foreignKey: {
            name: "groups_games_group_id_fk",
            table: "groups",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT"
            },
            mapping: "id"
          }
        },
        game_id: {
          type: "int",
          primaryKey: true,
          notNull: true,
          foreignKey: {
            name: "groups_games_game_id_fk",
            table: "games",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT"
            },
            mapping: "id"
          }
        }
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
      )
    ],
    callback
  );
};

exports.down = (db, callback) => {
  async.series(
    [
      db.dropTable.bind(db, "test"),
      db.dropTable.bind(db, "groups_games"),
      db.dropTable.bind(db, "groups_players"),
      db.dropTable.bind(db, "games_players"),
      db.dropTable.bind(db, "rounds_winners"),
      db.dropTable.bind(db, "rounds_participants"),
      db.dropTable.bind(db, "rounds"),
      db.dropTable.bind(db, "games"),
      db.dropTable.bind(db, "groups"),
      db.dropTable.bind(db, "players")
    ],
    callback
  );
};

exports._meta = {
  version: 1
};
