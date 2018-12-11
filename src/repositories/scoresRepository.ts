import { Pool, QueryResult, defaults } from "pg";

const pool: Pool = new Pool();

// By default COUNT is returned as a String, this allows it to be returned as a number.
defaults.parseInt8 = true;

export interface IScore {
  name: string;
  wins: number;
  played: number;
}

class ScoresRepository {
  async scores(groupId: number, gameId: number): Promise<QueryResult> {
    try {
      return await pool.query(
        `SELECT players.id, players.name,
          COUNT(rounds_players.is_winner) FILTER (WHERE is_winner = true AND rounds.game_id = games_players.game_id AND rounds.group_id = groups_players.group_id) AS wins,
 	        COUNT(rounds_players.player_id) FILTER (WHERE rounds.game_id = games_players.game_id AND rounds.group_id = groups_players.group_id) as played
        FROM players
        LEFT JOIN rounds_players
	        ON (rounds_players.player_id = players.id)
        INNER JOIN games_players
	        ON (games_players.player_id = players.id)
        INNER JOIN groups_players
	        ON (groups_players.player_id = players.id)
        LEFT JOIN rounds
	        ON (rounds_players.round_id = rounds.id)
        WHERE games_players.game_id = $1
        AND groups_players.group_id = $2
        AND (rounds.group_id = groups_players.group_id
	        OR rounds.group_id IS NULL)
        GROUP BY players.id;`,
        [gameId, groupId]
      );
    } catch (exception) {
      // TODO: Logging!
      throw exception;
    }
  }
}

export default ScoresRepository;
