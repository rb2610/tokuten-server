import { Pool, QueryResult } from "pg";

const pool: Pool = new Pool();

// TODO: Remove 'I' from interfaces.
export interface IPlayer {
  id: number;
  name: string;
}

class PlayerRepository {
  async addPlayer(player: IPlayer, groupId?: number): Promise<QueryResult> {
    const client = await pool.connect();

    try {
      await client.query(`BEGIN`);
      const result = await client.query(`
        INSERT INTO players(name)
        VALUES ($1)
        RETURNING *`,
        [player.name]);

      if(groupId !== undefined) {
        await client.query(`
          INSERT INTO groups_players(group_id, player_id)
          VALUES($1, $2)`,
          [groupId, result.rows[0].id]);
      }

      await client.query(`COMMIT`);

      return result;
    } catch (exception) {
      // TODO: Logging!
      await client.query(`ROLLBACK`);
      throw exception;
    } finally {
      client.release();
    }
  }
}

export default PlayerRepository;
