import { Router } from "express";
import { productsManager } from "../server.js";

const router = Router();

router.get("/", (req, res) => {
  const limit = +req.query.limit;
  const products = productsManager.getProducts();
  const allProducts = limit ? products.slice(0, limit) : products;
  // res.status(200).send({ success: true, data: allProducts });
  console.log(allProducts);
  res.render("index", { products: allProducts });
});

router.get("/:pid", (req, res) => {
  const pid = +req.params.pid;
  const product = productsManager.getProductById(pid);
  res.status(product.stat).send(product.msg);
});

router.post("/", (req, res) => {
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    category,
    stock,
  } = req.body;
  const product = productsManager.addProducts(
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    category,
    stock
  );
  res.status(product.stat).send(product.msg);
});

router.put("/:id", (req, res) => {
  const id = +req.params.id;
  const { fiedlModified } = req.body;
  const product = productsManager.updateProduct(id, fiedlModified);
  res.status(product.stat).send(product.msg);
});

router.delete("/:id", (req, res) => {
  const id = +req.params.id;
  const product = productsManager.deleteProduct(id);
  res.status(product.stat).send(product.msg);
});

export default router;
