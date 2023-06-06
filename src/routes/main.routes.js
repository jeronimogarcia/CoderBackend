import { Router } from "express";
import Users from "../modules/user-manager.js";
import SmallProducts from "../modules/smallProduct-manager.js";

const users = new Users();
const manager = new SmallProducts();

const mainRoutes = (io, store, baseUrl) => {
  const router = Router();

  router.get("/", async (req, res) => {
    store.get(req.sessionID, async (err, data) => {
      if (err) console.log(`Error al recuperar datos de sesión (${err})`);

      if (
        data !== null &&
        (req.session.userValidated || req.sessionStore.userValidated)
      ) {
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
        const result = await manager.getProductsWithPaginated(
          filter,
          options
        );
        res.render("products/index", {
          products: result
        });
        console.log("Usuario logeado");
      } else {
        res.render("login/index", {
          sessionInfo:
            req.session.userValidated !== undefined
              ? req.session
              : req.sessionStore,
        });
      }
    });
  });

  router.get("/logout", async (req, res) => {
    req.session.userValidated = req.sessionStore.userValidated = false;
    req.session.destroy((err) => {
      req.sessionStore.destroy(req.sessionID, (err) => {
        if (err) console.log(`Error al destruir sesión (${err})`);
        console.log("Sesión destruída");
        res.redirect(baseUrl);
      });
    });
  });

  router.post("/login", async (req, res) => {
    const { login_email, login_password } = req.body;
    const user = await users.validateUser(login_email, login_password);
    console.log(user)
    if (user === null) {
      req.session.userValidated = req.sessionStore.userValidated = false;
      req.session.errorMessage = req.sessionStore.errorMessage =
        "Usuario o clave no válidos";
    } else {
      req.session.userValidated = req.sessionStore.userValidated = true;
      req.session.errorMessage = req.sessionStore.errorMessage = "";
      req.session.admin = user.isAdmin
    }
    res.redirect(baseUrl);
  });

  return router;
};

export default mainRoutes;
