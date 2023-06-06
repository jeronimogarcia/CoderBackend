import { Router } from "express";
import { ChatMessages } from "../modules/chatMessage-manager.js";

const router = Router();
export const chatManager = new ChatMessages();

router.get("/", async (req, res) => {
  const data = await chatManager.getMsgs();
  res.render('chat/index', { data: data })
});

router.get("/:id", async (req, res) => {
  const id = +req.params.id;
  const chatMsgs = await chatManager.getMessagesById(id);
  res.render("index", {
    msgs: chatMsgs,
  });
});

router.post("/addMsg", async (req, res) => {
  try {
    await chatManager.addMsg(req.body);

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
