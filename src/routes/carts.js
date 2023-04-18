import { Router } from "express";
import { cartManager } from "../server.js";

const router = Router();

router.post("/", (req, res) => {
  const cart = cartManager.addCart(req.body);
  res.status(cart.stat).send(cart.msg);
});

router.get("/:cid", (req, res) => {
  const cid = +req.params.cid;
  const cart = cartManager.getCartById(cid);
  res.status(cart.stat).send(cart.msg);
});

router.post("/:cid/products", (req, res) => {
  const cid = +req.params.cid;
  const pid = +req.body.id;
  const updatedCart = cartManager.updateProductById(cid, pid, req.body);
  res.status(updatedCart.stat).send(updatedCart.msg);
});

export default router;
