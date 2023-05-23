import chatMessagesModel from "../models/chatMessagesModel.js";

export class ChatMessages {
  constructor() {
    this.status = 0;
    this.statusMsg = "Inicializado";
  }

  static requiredFields = [
    "email",
    "msg",
    "created"
  ];

  static #verifyRequiredFields = (obj) => {
    return ChatMessages.requiredFields.every(
      (field) =>
        Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== null
    );
  };

  static #objEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  checkStatus = () => {
    return this.status;
  };

  showStatusMsg = () => {
    return this.statusMsg;
  };

  addMsg = async (data) => {
    try {
      if (
        !ChatMessages.#objEmpty(data) &&
        ChatMessages.#verifyRequiredFields(data)
      ) {
        await chatMessagesModel.create(data);
        this.status = 1;
        this.statusMsg = "Producto registrado en bbdd";
      } else {
        console.log('failed')
        this.status = -1;
        this.statusMsg = `Faltan campos obligatorios (${ChatMessages.requiredFields.join(
          ", "
        )})`;
      }
    } catch (err) {
      this.status = -1;
      this.statusMsg = `AddProduct: ${err}`;
    }
  };

  getMsgs = async () => {
    try {
      const chatMsgs = await chatMessagesModel.find().lean();
      this.status = 1;
      this.statusMsg = "Mensajes recuperados";
      return chatMsgs;
    } catch (error) {
      this.status = -1;
      this.statusMsg = `getProducts: ${err}`;
    }
  };

  getMessagesById = async (id) => {
    try {
      const msgs = chatMessagesModel.findById(id);
      this.status = 1;
      return msgs;
    } catch (err) {
      this.status = -1;
      this.statusMsg = `getProductById: ${err}`;
    }
  };
}
