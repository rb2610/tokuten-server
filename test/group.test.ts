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

describe("Group", () => {
  describe("POST /group", () => {
    it("should add a new group", () => {
      return request(server)
        .post("/group")
        .send({ name: "New Group" })
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.deep.equal({
            data: [
              {
                id: 3,
                name: "New Group"
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
