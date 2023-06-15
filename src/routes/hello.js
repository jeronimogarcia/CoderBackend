import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.status(200).send({ status: "Ok", msg: "Hello" });
});

export default router;
