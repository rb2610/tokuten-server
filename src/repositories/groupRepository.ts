import { Pool, QueryResult } from "pg";

const pool: Pool = new Pool();

export interface IGroup {
  id: number;
  name: string;
}

class GroupRepository {
  async groups(): Promise<QueryResult> {
    try {
      return await pool.query(
        `
        SELECT id, name
        FROM groups`
      );
    } catch (exception) {
      // TODO: Logging!
      throw exception;
    }
  }

  async addGroup(group: IGroup): Promise<QueryResult> {
    try {
      return await pool.query(
        `
        INSERT INTO groups(name)
        VALUES ($1)
        RETURNING *`,
        [group.name]
      );
    } catch (exception) {
      // TODO: Logging!
      throw exception;
    }
  }
}

export default GroupRepository;
