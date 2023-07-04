import passport from 'passport';
import jwt from 'passport-jwt';
import dotenv from "dotenv";
dotenv.config({ path: "./src/config/config.env" });
const BASE_URL = "http://localhost:3000";

const PRIVATE_KEY = process.env.JWT_SECRET;

// Estrategia JWT
const JWTStrategy = jwt.Strategy;
const JWTExtractor = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    if (req && req.cookies) { // hay cookies
        return req.cookies['coder_login_token'];
    }

    return null;
}

const jwtData = {
    // El token se recupera desde las cookies
    jwtFromRequest: JWTExtractor.fromExtractors([cookieExtractor]),
    secretOrKey: PRIVATE_KEY
}

const verify = async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload);
    } catch(err) {
        return done(err.message);
    }
};

const initPassport = () => {
    passport.use('jwtAuth', new JWTStrategy(jwtData, verify));
}

const authentication = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.redirect(`${BASE_URL}/login`)
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

// Middleware de autorización
const authorization = (role) => {
    return async(req, res, next) => {
        if (!req.user) return res.status(401).send({ error: 'Unauthorized' });
        if (req.user.role != 'admin' && req.user.role != role) return res.status(403).send({ error: 'No permissions' });
        next();
    }
}

const authAdmin = () => {
  return async(req, res, next) => {
      if (!req.user) return res.status(401).send({ error: 'Unauthorized' });
      if (req.user.role != 'admin' ) return res.redirect(BASE_URL);
      next();
  }
}

export { initPassport, authentication, authorization, authAdmin };