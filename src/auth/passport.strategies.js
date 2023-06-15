import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";
import userModel from "../models/userModel.js";

const initializePassport = () => {
  const githubData = {
    clientID: "Iv1.b3511f3823906af6",
    clientSecret: "922a1696af4ea85d02cb731ba67dc5c117a9e377",
    callBackUrl: "http://localhost:3000/api/sessions/githubcallback",
  };

  const verifyAuthRegistration = async (userName, password, done) => {
    try {
      const user = await userModel.findOne({ userName: userName });

      if (user === null) {
        return done(null, { _id: 0 });
      } else {
        return done(null, false, {
          message: "El email ya se encuentra registrado",
        });
      }
    } catch (err) {
      return done(err.message);
    }
  };

  const verifyAuthGithub = async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);
      const user = await userModel.findOne({ userName: profile._json.email });

      if (!user) {
        done(null, false);
      } else {
        done(null, user);
      }
    } catch (error) {
      return done(err.message);
    }
  };

  passport.use(
    "authRegistration",
    new LocalStrategy(
      { usernameField: "userName", passwordField: "password" },
      verifyAuthRegistration
    )
  );
  passport.use("authGithub", new GithubStrategy(githubData, verifyAuthGithub));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err.message);
    }
  });
};
export default initializePassport;
