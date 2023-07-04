import { Router } from "express";
import SmallProducts from "../modules/smallProduct-manager.js";

const router = Router();
const manager = new SmallProducts();

const productRoutes = (io) => {
  router.get("/products", async (req, res) => {
    try {
      const products = await manager.getProducts();
      res.status(200).send({ status: "OK", data: products });
    } catch (err) {
      res.status(500).send({ status: "ERR", error: err });
    }
  });
  
  return router;
};

export default productRoutes;
