import { Pool, QueryResult } from "pg";

const schemaName : string = process.env.SCHEMA || "tokuten";
const pool : Pool = new Pool();

export interface IScore {
  id: number,
  name: string,
  wins: number,
  played: number
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

  async addPlayer(score : IScore) : Promise<QueryResult> {
    try {
      return await pool.query(`INSERT INTO ${schemaName}.test(name, wins, played) VALUES ($1, 0, 0) RETURNING *`, [score.name]); 
    } catch(exception) {
      // TODO: Logging!
      throw exception;
    }
  }

  async updatePlayerScore(id: string, score: IScore): Promise<QueryResult> {
    try {
      return await pool.query(`UPDATE ${schemaName}.test SET wins = $1, played = $2 WHERE id = $3 RETURNING *`, [score.wins, score.played, id]);
    } catch (exception) {
      // TODO: Logging!
      throw exception;
    }
  }
}

export default ScoresRepository;