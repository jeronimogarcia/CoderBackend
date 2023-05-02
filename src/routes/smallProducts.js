import { Router } from "express";
import { smallProductsManager } from "../server.js";

const router = Router();

router.get("/", (req, res) => {
  const limit = +req.query.limit;
  const products = smallProductsManager.getProducts();
  const allProducts = limit ? products.slice(0, limit) : products;
  res.render("index", { products: allProducts });
});

router.get("/realtimeproducts", (req, res) => {
  const limit = +req.query.limit;
  const products = smallProductsManager.getProducts();
  const allProducts = limit ? products.slice(0, limit) : products;
  res.render("smallProducts/index", { products: allProducts });
});

router.get("/:pid", (req, res) => {
  const pid = +req.params.pid;
  const product = smallProductsManager.getProductById(pid);
  res.status(product.stat).send(product.msg);
});

router.post("/", (req, res) => {
  const {
    title,
    price,
    category,
    stock,
  } = req.body;
  const product = smallProductsManager.addProducts(
    title,
    price,
    category,
    stock
  );
  res.status(product.stat).send(product.msg);
});

router.put("/:id", (req, res) => {
  const id = +req.params.id;
  const { fiedlModified } = req.body;
  const product = smallProductsManager.updateProduct(id, fiedlModified);
  res.status(product.stat).send(product.msg);
});

router.delete("/:id", (req, res) => {
  const id = +req.params.id;
  const product = smallProductsManager.deleteProduct(id);
  res.status(product.stat).send(product.msg);
});

export default router;
