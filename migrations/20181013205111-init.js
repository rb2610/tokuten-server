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
      db.runSql.bind(db, `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`),
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
          type: "uuid",
          primaryKey: true,
          notNull: true,
          defaultValue: new String("uuid_generate_v4()")
        },
        name: { type: "string", notNull: true }
      }),
      db.createTable.bind(db, "groups", {
        id: {
          type: "uuid",
          primaryKey: true,
          notNull: true,
          defaultValue: new String("uuid_generate_v4()")
        },
        name: { type: "string", notNull: true }
      }),
      db.createTable.bind(db, "games", {
        id: {
          type: "uuid",
          primaryKey: true,
          notNull: true,
          defaultValue: new String("uuid_generate_v4()")
        },
        name: { type: "string", notNull: true }
      }),
      db.createTable.bind(db, "rounds", {
        id: {
          type: "uuid",
          primaryKey: true,
          notNull: true,
          defaultValue: new String("uuid_generate_v4()")
        },
        game_id: {
          type: "uuid",
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
          type: "uuid",
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
        time: { type: "timestamp", notNull: true },
        game: { type: "uuid" }
      }),
      db.createTable.bind(db, "rounds_participants", {
        round_id: {
          type: "uuid",
          notNull: true,
          primaryKey: true,
          foreignKey: {
            name: "rounds_participants_round_id_fk",
            table: "rounds",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT"
            },
            mapping: "id"
          }
        },
        participant_id: {
          type: "uuid",
          notNull: true,
          primaryKey: true,
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
      db.createTable.bind(db, "rounds_winners", {
        round_id: {
          type: "uuid",
          notNull: true,
          primaryKey: true,
          foreignKey: {
            name: "rounds_winners_round_id_fk",
            table: "rounds",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT"
            },
            mapping: "id"
          }
        },
        winner_id: {
          type: "uuid",
          notNull: true,
          primaryKey: true,
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
      db.createTable.bind(db, "games_players", {
        game_id: {
          type: "uuid",
          notNull: true,
          primaryKey: true,
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
          type: "uuid",
          notNull: true,
          primaryKey: true,
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
          type: "uuid",
          notNull: true,
          primaryKey: true,
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
          type: "uuid",
          notNull: true,
          primaryKey: true,
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
          type: "uuid",
          notNull: true,
          primaryKey: true,
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
          type: "uuid",
          notNull: true,
          primaryKey: true,
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
      db.dropTable("test"),
      db.dropTable("players"),
      db.dropTable("groups"),
      db.dropTable("games"),
      db.dropTable("rounds"),
      db.dropTable("rounds_participants"),
      db.dropTable("rounds_winners"),
      db.dropTable("games_players"),
      db.dropTable("groups_players"),
      db.dropTable("groups_games")
    ],
    callback
  );
};

exports._meta = {
  version: 1
};
