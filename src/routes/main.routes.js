import { Router } from "express";
import SmallProducts from "../modules/smallProduct-manager.js";
import userModel from "../models/userModel.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import passport from '../auth/passport.strategies.js';

const manager = new SmallProducts();
const BASE_URL = "http://localhost:3000";

const mainRoutes = (store, baseUrl) => {
  const router = Router();

  router.get("/", async (req, res) => {
    store.get(req.sessionID, async (err, data) => {
      if (err) console.log(`Error al recuperar datos de sesión (${err})`);

      if (data !== null && req.sessionStore.userValidated) {
        const {
          limit = 10,
          page = 1,
          order,
          filterProp,
          filterName,
        } = req.query;
        let filter =
          filterName && filterProp ? { [filterProp]: filterName } : {};
        let options = { lean: true, limit: +limit || 10, page: +page || 1 };
        order ? (options["sort"] = { price: order }) : delete options["sort"];
        const result = await manager.getProductsWithPaginated(filter, options);
        res.render("products/index", {
          products: result,
        });
        console.log("Usuario logeado");
      } else {
        res.render("login/index", {
          sessionInfo:
            req.sessionStore.userValidated !== undefined
              ? req.sessionStore
              : req.sessionStore,
        });
      }
    });
  });

  router.get("/logout", async (req, res) => {
    req.sessionStore.userValidated = false;
    req.session.destroy((err) => {
      req.sessionStore.destroy(req.sessionID, (err) => {
        if (err) console.log(`Error al destruir sesión (${err})`);
        console.log("Sesión destruída");
        res.redirect(baseUrl);
      });
    });
  });

  router.post("/login", async (req, res) => {
    req.sessionStore.userValidated = false;
    const { login_email, login_password } = req.body;
    const user = await userModel.findOne({ userName: login_email });
    if (!user) {
      req.sessionStore.errorMessage = "No se encuentra el usuario";
      res.redirect(`${BASE_URL}/errorLogin`);
    } else if (!isValidPassword(user, login_password)) {
      req.sessionStore.errorMessage = "Clave incorrecta";
      res.redirect(`${BASE_URL}/errorLogin`);
    } else {
      console.log("req.sessionStore.admin", req.sessionStore.admin);
      req.sessionStore.userValidated = true;
      req.sessionStore.errorMessage = "";
      req.sessionStore.firstName = user.firstName;
      req.sessionStore.lastName = user.lastName;
      if (user.isAdmin === true) {
        req.sessionStore.admin = true;
      } else {
        req.sessionStore.admin = false;
      }
      res.redirect(BASE_URL);
    }
  });

  router.get("/register", async (req, res) => {
    res.render("register/index", {});
  });

  router.get("/errorLogin", async (req, res) => {
    res.render("login/error", {});
  });

  router.get("/errorRegister", async (req, res) => {
    res.render("register/error", {});
  });

  router.post("/register", passport.authenticate('authRegistration', { failureRedirect: '/errorRegister' }), async (req, res) => {
    const { firstName, lastName, userName, password } = req.body;

    if (!firstName || !lastName || !userName || !password)
      res.status(400).send("Falta campos obligatorios");

    const newUser = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      password: createHash(password),
      created: new Date(),
    };
    console.log(newUser);
    userModel.create(newUser);
    res.redirect(BASE_URL);
  });

  return router;
};

export default mainRoutes;
