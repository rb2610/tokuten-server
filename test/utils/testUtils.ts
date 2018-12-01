import { Pool } from "pg";

export async function setUpDatabase(pool: Pool) {
  return pool
    .query(`TRUNCATE players, groups, games, rounds RESTART IDENTITY CASCADE`)
    .then(() =>
      pool.query(`
        INSERT INTO players (name)
        VALUES ('Foo'), ('Roo'), ('Bob')`)
    )
    .then(() =>
      pool.query(`
        INSERT INTO groups (name)
        VALUES ('Test Group'), ('Other Group')`)
    )
    .then(() =>
      pool.query(`
        INSERT INTO games (name)
        VALUES ('Tekken 7'), ('Mario Kart')`)
    )
    .then(() =>
      pool.query(`
        INSERT INTO games_groups (game_id, group_id)
        VALUES (1, 1)`)
    )
    .then(() =>
      pool.query(`
        INSERT INTO games_players (game_id, player_id)
        VALUES (1, 1), (1, 2), (2, 1), (2, 2), (2, 3)`)
    )
    .then(() =>
      pool.query(`
        INSERT INTO groups_players (group_id, player_id)
        VALUES (1, 1), (1, 2), (2, 2), (2, 3)`)
    )
    .then(() =>
      pool.query(
        `
        INSERT INTO rounds (game_id, group_id, time)
        VALUES
          (1, 1, $1), (1, 1, $2), (1, 1, $3), (1, 1, $4), (1, 1, $5),
          (1, 2, $1), (1, 2, $2),
          (2, 1, $1), (2, 1, $2), (2, 1, $3),
          (2, 2, $1), (2, 2, $2)`,
        [new Date(1), new Date(2), new Date(3), new Date(4), new Date(5)]
      )
    )
    .then(() =>
      pool.query(
        `
        INSERT INTO rounds_players (round_game_id, round_group_id, round_time, player_id, is_winner)
        VALUES
          (1, 1, $1, 1, true), (1, 1, $1, 2, false),
          (1, 1, $2, 1, false), (1, 1, $2, 2, true),
          (1, 1, $3, 1, true), (1, 1, $3, 2, false),
          (1, 1, $4, 1, false), (1, 1, $4, 2, true),
          (1, 1, $5, 1, true), (1, 1, $5, 2, false),
          (2, 1, $1, 1, true), (2, 1, $1, 2, false),
          (2, 1, $2, 1, false), (2, 1, $2, 2, true),
          (2, 1, $3, 1, false), (2, 1, $3, 2, true),
          (2, 2, $1, 2, false), (2, 2, $1, 3, true)`,
        [new Date(1), new Date(2), new Date(3), new Date(4), new Date(5)]
      )
    );
}