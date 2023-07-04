import { Router } from "express";
import SmallProducts from "../modules/smallProduct-manager.js";
import { isValidPassword, createHash } from "../utils/validPassword.js";
import { authentication, authorization } from "../auth/passport.config.js";
import { generateToken, authToken } from "../auth/jwt.config.js";
import UserAuth from "../models/UserAuth.js";

const manager = new SmallProducts();

const mainRoutes = (io, BASE_URL) => {
  const router = Router();

  router.get("/", authentication("jwtAuth"), async (req, res) => {
    const { limit = 10, page = 1, order, filterProp, filterName } = req.query;
    let filter = filterName && filterProp ? { [filterProp]: filterName } : {};
    let options = { lean: true, limit: +limit || 10, page: +page || 1 };
    order ? (options["sort"] = { price: order }) : delete options["sort"];
    const result = await manager.getProductsWithPaginated(filter, options);
    res.render("products/index", {
      products: result,
    });
  });

  router.get("/logout", async (req, res) => {
    res.clearCookie("coder_login_token");
    res.redirect("/login");
  });

  router.get("/login", async (req, res) => {
    res.render("login", {});
  });

  router.post("/login", async (req, res) => {
    const { login_email, login_password } = req.body;
    const user = await UserAuth.findOne({ email: login_email }).select(
      "+password"
    );
    if (!user) {
      res.redirect("/login");
    } else {
      if (!isValidPassword(user.password, login_password)) {
        res.redirect("/login");
      } else {
        const date = new Date();

        const userdataForToken = {
          firstName: user.first_name,
          lastName: user.last_name,
          userEmail: user.email,
          role: user.role,
        };
        const token = generateToken(userdataForToken, "24h");

        res
          .cookie("coder_login_token", token, {
            maxAge: date.setDate(date.getDate() + 1),
            secure: false, 
            httpOnly: true,
          })
          .redirect("/");
      }
    }
  });

  router.get("/errorLogin", async (req, res) => {
    res.render("login/error", {});
  });

  router.get("/register", async (req, res) => {
    res.render("register/index", {});
  });

  router.post("/register", async (req, res) => {
    const { firstName, lastName, userName, password } = req.body;

    if (!firstName || !lastName || !userName || !password)
      res.status(400).send("Falta campos obligatorios");

    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email: userName,
      password: createHash(password),
      role: "user",
    };
    UserAuth.create(newUser);
    res.redirect(BASE_URL);
  });

  return router;
};

export default mainRoutes;
