import { Router } from "express";
import { Carts } from "../modules/cart-manager.js";

const router = Router();
export const cartManager = new Carts();

const validate = async (req, res, next) => {
  if (req.sessionStore.userValidated) {
    next();
  } else {
    res.status(401).send({
      status: "ERR",
      error: "No tiene autorización para realizar esta solicitud",
    });
  }
};

router.get('/allCarts', validate,  async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.render("carts/allCarts", {
      carts: carts,
    });
  } catch (err) {
    res.status(500).send({ status: "ERR", error: err });
  }
})

router.post("/addCart", async (req, res) => {
  try {
    await cartManager.addCart(req.body);

    if (cartManager.checkStatus() === 1) {
      res.status(200).send({ status: "OK", msg: cartManager.showStatusMsg() });
    } else {
      res
        .status(400)
        .send({ status: "ERR", error: cartManager.showStatusMsg() });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", error: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cart = await cartManager.getCartById(id);
    res.render("carts/index", {
      products: cart.products,
    });
  } catch (err) {
    res.status(500).send({ status: "ERR", error: err });
  }
});

export default router;
