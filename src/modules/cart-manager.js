import cartModel from "../models/cartModel.js";

export class Carts {
  constructor() {
    this.status = 0;
    this.statusMsg = "Inicializado";
  }

  static requiredFields = [
    "products",
  ];

  static #verifyRequiredFields = (obj) => {
    return Carts.requiredFields.every(
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

  addCart = async (data) => {
    try {
      if (
        !Carts.#objEmpty(data) &&
        Carts.#verifyRequiredFields(data)
      ) {
        await cartModel.create(data);
        this.status = 1;
        this.statusMsg = "Carrito registrado en bbdd";
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
}
