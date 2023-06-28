import { Router } from "express";
import Users from "../modules/user-manager.js";
import SmallProducts from "../modules/smallProduct-manager.js";

const users = new Users();
const manager = new SmallProducts();

const mainRoutes = (io, baseUrl) => {
  const router = Router();

  router.get("/", async (req, res) => {
    const { limit = 10, page = 1, order, filterProp, filterName } = req.query;
    let filter = filterName && filterProp ? { [filterProp]: filterName } : {};
    let options = { lean: true, limit: +limit || 10, page: +page || 1 };
    order ? (options["sort"] = { price: order }) : delete options["sort"];
    const result = await manager.getProductsWithPaginated(filter, options);

    // res.render("products/index", {
    //   products: result
    // });
    // console.log("Usuario logeado");
    // res.render("login/index", {
    // });
  });

  router.get("/logout", async (req, res) => {
    res.redirect(baseUrl);
  });

  router.post("/login", async (req, res) => {
    const { login_email, login_password } = req.body;
    const user = await users.validateUser(login_email, login_password);
    console.log(user);
    res.redirect(baseUrl);
  });

  return router;
};

export default mainRoutes;
