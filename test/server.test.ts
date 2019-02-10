import server from "../src/server";
import chai from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";

chai.use(chaiHttp);
const expect = chai.expect,
  and = chai.expect;
const request = chai.request;

describe("Server API", () => {
  describe("status", () => {
    it("should return a status JSON", () => {
      return request(server)
        .get("/status")
        .then(response => {
          expect(response).to.have.status(200);
          and(response.body).to.deep.equal({
            status: "Most Excellent"
          });
        })
        .catch(error => {
          throw error;
        });
    });
  });
});
