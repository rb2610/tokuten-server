import { Pool, PoolClient } from "pg";

class ScoresRepository {
  // TODO: DEPENDENCY INJECTION!!
  pool : Pool = new Pool();

  /**
   * 
   */
  async scores() {
    let client : PoolClient = await this.pool.connect();

    try {
      return await client.query(`SELECT * FROM tokuten.test`);
    } finally {
      client.release();
    }
  }
}

export default ScoresRepository;