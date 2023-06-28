import { Router } from "express";
import SmallProducts from "../modules/smallProduct-manager.js";

const router = Router();
export const manager = new SmallProducts();
// const validate = async (req, res, next) => {
//   if (req.session.userValidated && req.session.admin) {
//     next();
//   } else {
//     res.status(401).send({
//       status: "ERR",
//       error: "No tiene autorización para realizar esta solicitud",
//     });
//   }
// };

router.get("/", async (req, res) => {
  const smallProducts = await manager.getProducts();
  res.render("smallProducts/index", {
    products: smallProducts,
  });
});

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

router.delete("/:id",  async (req, res) => {
  const id = req.params.id;
  try {
    await manager.deleteProduct(id);
    if (manager.checkStatus() === 1) {
      res.status(200).send({ status: "OK", msg: manager.showStatusMsg() });
    } else {
      res.status(400).send({ status: "ERR", error: manager.showStatusMsg() });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", error: err });
  }
});

router.put("/update", async (req, res) => {
  try {
    const { id, updatedProduct } = req.body;
    await manager.updateProduct(id, updatedProduct);

    if (manager.checkStatus() === 1) {
      res.status(200).send({ status: "OK", msg: manager.showStatusMsg() });
    } else {
      res.status(400).send({ status: "ERR", error: manager.showStatusMsg() });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", error: err });
  }
});

export default router;
