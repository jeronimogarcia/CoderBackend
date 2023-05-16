import { Router } from "express";
import { SmallProducts } from "../modules/smallProduct-manager.js";

const router = Router();
export const manager = new SmallProducts();

router.get("/", async (req, res) => {
  const smallProducts = await manager.getProducts();
  res.render("index", {
    products: smallProducts,
  });
});

router.get("/realtimeproducts", async (req, res) => {
  const smallProducts = await manager.getProducts();
  res.render("smallProducts/index", {
    products: smallProducts,
  });
});

// router.get("/:pid", (req, res) => {
//   const pid = +req.params.pid;
//   const product = smallProductsManager.getProductById(pid);
//   res.status(product.stat).send(product.msg);
// });

router.post("/addProduct", async (req, res) => {
  try {
    await manager.addProduct(req.body);

    if (manager.checkStatus() === 1) {
      res.status(200).send({ status: "OK", msg: manager.showStatusMsg() });
    } else {
      res.status(400).send({ status: "ERR", error: manager.showStatusMsg() });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", error: err });
  }
});

// router.put("/:id", (req, res) => {
//   const id = +req.params.id;
//   const { fiedlModified } = req.body;
//   const product = smallProductsManager.updateProduct(id, fiedlModified);
//   res.status(product.stat).send(product.msg);
// });

// router.delete("/:id", (req, res) => {
//   const id = +req.params.id;
//   const product = smallProductsManager.deleteProduct(id);
//   res.status(product.stat).send(product.msg);
// });

export default router;
