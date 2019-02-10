import { Pool, QueryResult } from "pg";

const pool: Pool = new Pool();

class AuthRepository {
  async authenticatePlayer(username: string, password: string): Promise<QueryResult> {
    try {
      return await pool.query(
        `
        SELECT name
        FROM players
        WHERE lower(name) = lower($1)
        AND password = crypt($2, password)`,
        [username, password]
      );
    } catch (exception) {
      // TODO: Logging!
      throw exception;
    }
  }
}

export default AuthRepository;
