import server from "../src/server";
import chai from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";
import { Pool } from "pg";
import { setUpDatabase } from "./utils/testUtils";

chai.use(chaiHttp);
const expect = chai.expect,
  and = chai.expect;
const request = chai.request;

const pool: Pool = new Pool();

// TODO: Test auth
describe("Round", () => {
  describe("POST /rounds", () => {
    it("should add a new round for a given group and game with the given participants and winner", () => {
      return request(server)
        .post("/rounds?groupId=2&gameId=1")
        .send({
          participants: [
            {
              id: 2,
              is_winner: false
            },
            {
              id: 3,
              is_winner: true
            }
          ]
        })
        .then(response => {
          expect(response).to.have.status(200);
          // TODO: Use Deep Equal when matchers are available in Chai 5
          // expect(response.body).to.deep.equal({
          //   data: [
          //     {
          //       id: 13,
          //       game_id: 2,
          //       group_id: 2,
          //       time: "2018-12-08T19:51:00.889Z"
          //     }
          //   ]
          // });
          and(response.body.data).to.have.length(1);
          and(response.body.data[0].id).to.equal(10);
          and(response.body.data[0].game_id).to.equal(1);
          and(response.body.data[0].group_id).to.equal(2);
          and(response.body.data[0].time).to.match(
            new RegExp(
              "[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9](?:.[0-9]+)?Z"
            )
          );
        })
        .then(() =>
          pool
            .query(
              `
            SELECT player_id
            FROM rounds_players
            WHERE round_id = 10`
            )
            .then(result => {
              expect(result.rows[0].player_id).to.equal(2);
              and(result.rows[1].player_id).to.equal(3);
            })
        )
        .catch(error => {
          throw error;
        });
    });

    // TODO: Add DB Trigger to satisfy this requirement
    // it("should not add a round if the participants are not members of the round's game or group", () => {
    //   return request(server)
    //     .post("/round?groupId=2&gameId=1")
    //     .send({
    //       participants: [
    //         {
    //           id: 3,
    //           is_winner: true
    //         },
    //         {
    //           id: 4,
    //           is_winner: false
    //         }
    //       ]
    //     })
    //     .then(response => {
    //       expect(response).to.have.status(400);
    //       expect(response.body).to.equal({
    //         error: "Given Participants are not members of the game and/or group."
    //       });
    //     });
    // });
  });

  beforeEach(done => {
    setUpDatabase(pool).then(() => done());
  });
});
