import { Pool, QueryResult, defaults } from "pg";

const pool: Pool = new Pool();

// By default COUNT is returned as a String, this allows it to be returned as a number.
defaults.parseInt8 = true;

export interface IScore {
  name: string;
  wins: number;
  played: number;
}

class ScoreTableRepository {
  async scores(groupId: number, gameId: number): Promise<QueryResult> {
    try {
      return await pool.query(
        `SELECT players.name,
	        COUNT(rounds_players.is_winner) FILTER (WHERE is_winner = true) AS wins,
	        COUNT(rounds_players.player_id) as played
        FROM players
        LEFT JOIN rounds_players
          ON (rounds_players.player_id = players.id)
        INNER JOIN games_players
          ON (games_players.player_id = players.id)
        INNER JOIN groups_players
          ON (groups_players.player_id = players.id)
        WHERE games_players.game_id = $1
        AND groups_players.group_id = $2
        AND (rounds_players.round_game_id = games_players.game_id
          OR rounds_players.round_game_id IS NULL)
        AND (rounds_players.round_group_id = groups_players.group_id
          OR rounds_players.round_group_id IS NULL)
        GROUP BY players.id;`,
        [gameId, groupId]
      );
    } catch (exception) {
      // TODO: Logging!
      throw exception;
    }
  }
}

export default ScoreTableRepository;
