import jwt from "express-jwt";
import { Request } from "express";

// TODO: Remove?
const getTokenFromHeaders = (request: Request) => {
  const authorization = request.headers.authorization;

  if (authorization && authorization.split(" ")[0] === "Token") {
    return authorization.split(" ")[1];
  }

  return null;
};

const auth = {
  required: jwt({
    secret: "A Secret Secret",
    userProperty: "Payload",
    getToken: getTokenFromHeaders
  }),
  optional: jwt({
    secret: "A Secret Secret",
    userProperty: "Payload",
    getToken: getTokenFromHeaders,
    credentialsRequired: false
  })
};

export default auth;