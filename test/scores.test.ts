import server from "../src/server";
import chai from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";
import { Pool, defaults } from "pg";
import { setUpDatabase } from "./utils/testUtils";
import { __await } from "tslib";

// By default COUNT is returned as a String, this allows it to be returned as a number.
defaults.parseInt8 = true;

chai.use(chaiHttp);
const expect = chai.expect,
  and = chai.expect;
const request = chai.request;

const pool: Pool = new Pool();

// TODO: Test auth
describe("ScoreTable", () => {
  describe("GET /scores/group/:groupId/game/:gameId", () => {
    it("should return a JSON containing scores for the given group and game", () => {
      return request(server)
        .get("/scores/group/1/game/1")
        .then(response => {
          expect(response).to.have.status(200);
          and(response.body).to.deep.equal({
            data: [
              {
                id: 2,
                name: "Roo",
                wins: 2,
                played: 5
              },
              {
                id: 1,
                name: "Foo",
                wins: 3,
                played: 5
              }
            ]
          });
        })
        .catch(error => {
          throw error;
        });
    });

    it("should return players in group and game who have no rounds played", () => {
      return insertTestPlayer(pool)
        .then(() => {
          return request(server)
            .get("/scores/group/1/game/1")
            .then(response => {
              expect(response).to.have.status(200);
              and(response.body).to.deep.equal({
                data: [
                  {
                    id: 4,
                    name: "ジョンさん",
                    wins: 0,
                    played: 0
                  },
                  {
                    id: 2,
                    name: "Roo",
                    wins: 2,
                    played: 5
                  },
                  {
                    id: 1,
                    name: "Foo",
                    wins: 3,
                    played: 5
                  }
                ]
              });
            });
        })
        .catch(error => {
          throw error;
        });
    });

    it("should not return players not in the selected group (even with no rounds played)", () => {
      return insertTestPlayer(pool)
        .then(() => {
          return request(server)
            .get("/scores/group/5/game/1")
            .then(response => {
              expect(response).to.have.status(200);
              and(response.body).to.deep.equal({
                data: []
              });
            });
        })
        .catch(error => {
          throw error;
        });
    });
  });

  beforeEach(done => {
    setUpDatabase(pool).then(() => done());
  });

  async function insertTestPlayer(pool: Pool) {
    const client = await pool.connect();

    try {
      await client.query(`BEGIN`);

      await client.query(`
        INSERT INTO players(name)
        VALUES ('ジョンさん')`);
      await client.query(`
        INSERT INTO groups_players(group_id, player_id)
        VALUES(1, 4)`);

      await client.query(`COMMIT`);
    } catch (exception) {
      await client.query(`ROLLBACK`);
      throw exception;
    } finally {
      client.release();
    }
  }
});
