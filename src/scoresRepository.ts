import { Pool, PoolClient } from "pg";

class ScoresRepository {
  // TODO: DEPENDENCY INJECTION!!
  pool : Pool = new Pool();

  /**
   * 
   */
  async scores() {
    let client: PoolClient = await this.pool.connect();
    const schemaName = process.env.SCHEMA;

    try {
      return await client.query(`SELECT * FROM ${schemaName}.test`);
    } finally {
      client.release();
    }
  }
}

export default ScoresRepository;