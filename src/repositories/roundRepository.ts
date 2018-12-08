import { Pool, QueryResult } from "pg";

const pool: Pool = new Pool();

export interface IParticipant {
  id: number;
  is_winner: boolean;
}

class RoundRepository {
  async addRound(
    groupId: number,
    gameId: number,
    participants: Array<IParticipant>
  ): Promise<QueryResult> {
    const client = await pool.connect();

    try {
      await client.query(`BEGIN`);
      const result = await client.query(
        `
          INSERT INTO rounds(group_id, game_id)
          VALUES ($1, $2)
          RETURNING *`,
        [groupId, gameId]
      );

      await client.query(
        `
          INSERT INTO rounds_players(round_id, player_id, is_winner)
          VALUES ${this.queryValueDefinition(participants)}`,
        this.queryValues(participants, result)
      );

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

  private queryValues(
    participants: IParticipant[],
    result: QueryResult
  ): Array<string | number | boolean> {
    return participants.reduce(
      (accumulator: Array<number | string | boolean>, participant) =>
        accumulator.concat([participant.id, participant.is_winner]),
      [result.rows[0].id]
    );
  }

  private queryValueDefinition(participants: IParticipant[]) {
    let index = 2;
    const roundsPlayersQueryValueString = participants
      .map(() => `($1, $${index++}, $${index++})`)
      .join(", ");
    return roundsPlayersQueryValueString;
  }
}

export default RoundRepository;
