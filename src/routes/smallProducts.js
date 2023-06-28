import { Router } from "express";
import SmallProducts from "../modules/smallProduct-manager.js";

const router = Router();
const manager = new SmallProducts();

const productRoutes = (io) => {
  // const validate = async (req, res, next) => {
  //   if (req.session.userValidated) {
  //     next();
  //   } else {
  //     res
  //       .status(401)
  //       .send({
  //         status: "ERR",
  //         error: "No tiene autorización para realizar esta solicitud",
  //       });
  //   }
  // };

  // router.get("/realtimeproducts", validate, async (req, res) => {
  //   const smallProducts = await manager.getProducts();
  //   res.render("smallProducts/index", {
  //     products: smallProducts,
  //   });
  // })

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
