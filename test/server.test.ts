import server from "../src/server";
import chai from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

describe("Server API", () => {
  describe("scoreData", () => {
    it("should return a JSON containing score data", () => {
      return request(server)
        .get("/api/scoreData")
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.deep.equal({
            data: [
              {
                ID: 1,
                NAME: "Foo",
                WINS: 5
              },
              {
                ID: 2,
                NAME: "Roo",
                WINS: 2
              }
            ]
          });
        })
        .catch(error => {
          throw error;
        });
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
});
