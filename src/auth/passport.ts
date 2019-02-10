import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import AuthRepository from "../repositories/authRepository";

const authRepository = new AuthRepository();

export default () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password"
      },
      (username, password, done) => {
        authRepository
          .authenticatePlayer(username, password)
          .then(result => {
            if (result.rowCount > 0) {
              return done(null, { username: username });
            } else {
              return done(null, false);
            }
          })
          .catch(error => {
            return done(error);
          });
      }
    )
  );

  passport.serializeUser((user: any, done: any) => {
    done(null, user);
  });

  passport.deserializeUser((id: any, done: any) => {
    done(null, id);
  });
};
