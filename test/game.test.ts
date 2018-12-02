import server from "../src/server";
import chai from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

describe("Game", () => {
  describe("POST /game", () => {
    it("should add a new game", () => {
      return request(server)
        .post("/game")
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
});
