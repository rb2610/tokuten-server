import { Pool, QueryResult } from "pg";

const pool: Pool = new Pool();

export interface IGame {
  id: number;
  name: string;
}

class GameRepository {
  async addGame(game: IGame): Promise<QueryResult> {
    try {
      return await pool.query(`
        INSERT INTO games(name)
        VALUES ($1)
        RETURNING *`,
        [game.name]);
    } catch (exception) {
      // TODO: Logging!
      throw exception;
    }
  }
}

export default GameRepository;
