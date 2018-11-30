import { Pool, QueryResult } from "pg";

const pool: Pool = new Pool();

export interface IScore {
  name: string;
  wins: number;
  played: number;
}

class ScoreTableRepository {
  async scores(groupId: number, gameId: number): Promise<QueryResult> {
    try {
      return await pool.query(`
        SELECT players.name,
	        COUNT(rounds_players.is_winner) FILTER (WHERE is_winner = true) AS wins,
	        COUNT(*) AS played
        FROM players, rounds_players
        WHERE rounds_players.player_id = players.id
        AND rounds_players.round_group_id = $1
        AND rounds_players.round_game_id = $2
        GROUP BY players.id;`,
        [groupId, gameId]);
    } catch (exception) {
      // TODO: Logging!
      throw exception;
    }
  }
}

export default ScoreTableRepository;
