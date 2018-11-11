import server from "../src/server";
import chai from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";
import { Pool } from "pg";

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

const pool: Pool = new Pool();
const schemaName: string = process.env.SCHEMA || "tokuten";

describe("Server API", () => {
  describe("GET scoreData", () => {
    it("should return a JSON containing score data", () => {
      return request(server)
        .get("/api/scoreData")
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.deep.equal({
            data: [
              {
                id: 1,
                name: "Foo",
                wins: 5
              },
              {
                id: 2,
                name: "Roo",
                wins: 2
              }
            ]
          });
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe("PUT scoreData", () => {
    it("should insert score data provided as JSON into the Database", () => {
      return request(server)
        .post("/api/scoreData")
        .send({
          name: "Bob",
          wins: 1
        })
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.deep.equal({
            data: [
              {
                id: 3,
                name: "Bob",
                wins: 1
              }
            ]
          });
        })
        .catch(error => {
          throw error;
        })
    });
  });

  describe("status", () => {
    it("should return a status JSON", () => {
      return request(server)
        .get("/api/status")
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.deep.equal({
            status: "Most Excellent"
          });
        })
        .catch(error => {
          throw error;
        });
    });
  });

  beforeEach(done => {
    pool.query(`TRUNCATE ${schemaName}.test`)
      .then(() => pool.query(`ALTER SEQUENCE test_id_seq RESTART`))
      .then(() => pool.query(`INSERT INTO ${schemaName}.test (name, wins) VALUES ('Foo', 5), ('Roo', 2)`)).then(() => done());
  });

  afterEach((done) => {
    pool.query(`TRUNCATE ${schemaName}.test`)
      .then(() => pool.query(`ALTER SEQUENCE test_id_seq RESTART`))
      .then(() => done());
  })
});
