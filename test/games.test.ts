import server from "../src/server";
import chai from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";
import { Pool } from "pg";
import { setUpDatabase } from "./utils/testUtils";

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

const pool: Pool = new Pool();

describe("Game", () => {
  describe("GET /games", () => {
    it("should list all available games", () => {
      return request(server)
        .get("/games")
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.deep.equal({
            data: [
              {
                id: 1,
                name: "Tekken 7"
              },
              {
                id: 2,
                name: "Mario Kart"
              }
            ]
          });
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe("POST /games", () => {
    it("should add a new game", () => {
      return request(server)
        .post("/games")
        .send({ name: "Smash Bros. Ultimate" })
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.deep.equal({
            data: [
              {
                id: 3,
                name: "Smash Bros. Ultimate"
              }
            ]
          });
        })
        .catch(error => {
          throw error;
        });
    });
  })

  beforeEach(done => {
    setUpDatabase(pool).then(() => done());
  });
});
