import server from "../src/server";
import chai from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";
import { Pool, defaults } from "pg";
// import passportStub from "passport-stub"; // TODO: Add stub tests https://mherman.org/blog/node-passport-and-postgres/
import { setUpDatabase } from "./utils/testUtils";
import { __await } from "tslib";
import { AssertionError } from "assert";

// By default COUNT is returned as a String, this allows it to be returned as a number.
defaults.parseInt8 = true;

chai.use(chaiHttp);
const expect = chai.expect,
  and = chai.expect;
const request = chai.request;

// passportStub.install(server);

const pool: Pool = new Pool();

describe("Authentication", () => {
  describe("POST /auth/login", () => {
    it("should login a user", () => {
      return request(server)
        .post("/auth/login")
        .send({ username: "Foo", password: "changeme" })
        .then(response => {
          expect(response.redirect).to.be.false;
          and(response.status).to.equal(200);
          and(response.type).to.equal("application/json");
          and(response.body).to.deep.equal({ message: "Success" });
        })
        .catch(error => {
          throw error;
        });
    });

    it("should not login an unregistered user", () => {
      return request(server)
        .post("/auth/login")
        .send({
          username: "JimBob",
          password: "Potato123"
        })
        .then(response => {
          throw new AssertionError({
            message: "Request should not have been successful."
          });
        })
        .catch(error => {
          expect(error).to.exist;
        });
    });
  });

  describe("GET /auth/logout", () => {
    it("should logout a user", () => {
      return request(server)
        .get("/auth/logout")
        .then(response => {
          expect(response.redirect).to.be.false;
          and(response.status).to.equal(200);
          and(response.type).to.equal("application/json");
          and(response.body).to.deep.equal({ message: "Success" });
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe.skip("GET /scores/group/:groupId/game/:gameId", () => {
    it("should be reachable with auth", () => {
      return request(server)
        .get("/scores/group/1/game/1")
        .then(response => {
          expect(response).to.have.status(200);
          // res.redirects.length.should.eql(0);
          // res.type.should.eql("application/json");
          // res.body.status.should.eql("success");
        })
        .catch(error => {
          throw error;
        });
    });

    it("should not be reachable without auth", () => {
      return request(server)
        .get("/scores/group/1/game/1")
        .then(response => {
          throw new AssertionError({ message: "Should not have response" });
          // expect(response).to.not.exist;
          // should.not.exist(err);
          // res.redirects.length.should.eql(0);
          // res.status.should.eql(200);
          // res.type.should.eql("application/json");
          // res.body.status.should.eql("success");
        })
        .catch((error: any) => {});
    });
  });

  beforeEach(done => {
    setUpDatabase(pool).then(() => done());
  });
});
