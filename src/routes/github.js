import { Router } from "express";
import passport from "passport";
import initializePassport from "../auth/passport.strategies.js";

initializePassport();

const router = Router();

router.get('/github', passport.authenticate('authGithub', { scope: ['user:email'] }), async (req, res) => {
});

router.get(
  "/githubcallback",
  passport.authenticate("authGithub", { failureRedirect: "/pruebafailure" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/success");
  }
);

export default router;
