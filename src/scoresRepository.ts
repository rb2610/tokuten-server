import { Pool, QueryResult } from "pg";

const schemaName : string = process.env.SCHEMA || "tokuten";
const pool : Pool = new Pool();

export interface IScore {
  id: number,
  name: string,
  wins: number
}

class ScoresRepository {
  async scores() : Promise<QueryResult> {
    try {
      return await pool.query(`SELECT * FROM ${schemaName}.test`);
    } catch(exception) {
      // TODO: Logging!
      throw exception;
    }
  }

  async putScore(score : IScore) : Promise<QueryResult> {
    try {
      return await pool.query(`INSERT INTO ${schemaName}.test(name, wins) VALUES ($1, $2) RETURNING *`, [score.name, score.wins]); 
    } catch(exception) {
      // TODO: Logging!
      throw exception;
    }
  }
}

export default ScoresRepository;