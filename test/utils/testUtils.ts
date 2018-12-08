import { Pool } from "pg";

export async function setUpDatabase(pool: Pool) {
  return pool
    .query(`TRUNCATE games_groups, groups_players, games_players, rounds_players, rounds, games, groups, players RESTART IDENTITY CASCADE`)
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
        INSERT INTO rounds_players (round_id, player_id, is_winner)
        VALUES
          (1, 1, true), (1, 2, false),
          (2, 1, false), (2, 2, true),
          (3, 1, true), (3, 2, false),
          (4, 1, false), (4, 2, true),
          (5, 1, true), (5, 2, false),
          (6, 1, true), (6, 2, false),
          (7, 1, false), (7, 2, true),
          (8, 1, false), (8, 2, true),
          (9, 2, false), (9, 3, true)`
      )
    );
}