import server from "../src/server";
import chai from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";
import { Pool } from "pg";
import { setUpDatabase } from "./utils/testUtils"

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

const pool: Pool = new Pool();

describe("Player", () => {
  describe("POST /players", () => {
    it("should add a new player", () => {
      return request(server)
        .post("/players")
        .send({ name: "ジョンさん" })
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.deep.equal({
            data: [
              {
                id: 4,
                name: "ジョンさん"
              }
            ]
          });
        })
        .catch(error => {
          throw error;
        });
    });

    it("should add a new player assigned to a given group", () => {
      return request(server)
        .post("/players?groupId=1")
        .send({ name: "ジョンさん" })
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.deep.equal({
            data: [
              {
                id: 4,
                name: "ジョンさん"
              }
            ]
          });
        })
        .then(() =>
          pool.query(`
            SELECT COUNT(*)
            FROM groups_players
            WHERE player_id = 4
            AND group_id = 1`)
            .then((result) =>
              expect(result.rows[0].count).to.equal(1, "Group count should be 1")
          ))
        .catch(error => {
          throw error;
        });
    });
  });

  beforeEach(done => {
    setUpDatabase(pool).then(() => done());
  });
});
