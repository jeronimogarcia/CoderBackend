import mongoose from "mongoose";
import smallPoductModel from "../models/smallProductsModel.js";

export class SmallProducts {
  constructor() {
    this.status = 0;
    this.statusMsg = "Inicializado";
  }

  static requiredFields = [
    "description",
    "price",
    "stock",
    "title",
    "category",
  ];

  static #verifyRequiredFields = (obj) => {
    return SmallProducts.requiredFields.every(
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

  addProduct = async (product) => {
    try {
      if (
        !SmallProducts.#objEmpty(product) &&
        SmallProducts.#verifyRequiredFields(product)
      ) {
        console.log('create')
        console.log(product)
        await smallPoductModel.create(product);
        this.status = 1;
        this.statusMsg = "Producto registrado en bbdd";
      } else {
        console.log('failed')
        this.status = -1;
        this.statusMsg = `Faltan campos obligatorios (${SmallProducts.requiredFields.join(
          ", "
        )})`;
      }
    } catch (err) {
      this.status = -1;
      this.statusMsg = `AddProduct: ${err}`;
    }
  };

  getProducts = async () => {
    try {
      const smallProducts = await smallPoductModel.find().lean();
      this.status = 1;
      this.statusMsg = "Productos recuperados";
      return smallProducts;
    } catch (error) {
      this.status = -1;
      this.statusMsg = `getProducts: ${err}`;
    }
  };

  getProductById = async (id) => {
    try {
      const product = smallPoductModel.findById(id);
      this.status = 1;
      return product;
    } catch (err) {
      this.status = -1;
      this.statusMsg = `getProductById: ${err}`;
    }
  };

  updateProduct = async (id, data) => {
    try {
      if (data === undefined || Object.keys(data).length === 0) {
        this.status = -1;
        this.statusMsg = "Se requiere body con data";
      } else {
        const process = await smallPoductModel.updateOne(
          { _id: new mongoose.Types.ObjectId(id) },
          data
        );
        this.status = 1;
        process.modifiedCount === 0
          ? (this.statusMsg = "El ID no existe o no hay cambios por realizar")
          : (this.statusMsg = "Producto actualizado");
      }
    } catch (err) {
      this.status = -1;
      this.statusMsg = `updateProduct: ${err}`;
    }
  };

  deleteProduct = async (id) => {
    try {
      const process = await smallPoductModel.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      this.status = 1;
      process.deletedCount === 0
        ? (this.statusMsg = "El ID no existe")
        : (this.statusMsg = "Producto borrado");
    } catch (err) {
      this.status = -1;
      this.statusMsg = `deleteProduct: ${err}`;
    }
  };
}
