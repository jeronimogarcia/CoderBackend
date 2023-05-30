import cartModel from "../models/cartModel.js";
import mongoose from "mongoose";

export class Carts {
  constructor() {
    this.status = 0;
    this.statusMsg = "Inicializado";
  }

  static requiredFields = ["products"];

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

  getAllCarts = async () => {
    try {
      const carts = await cartModel.find().lean();
      this.status = 1;
      return carts;
    } catch (err) {
      this.status = -1;
      this.statusMsg = `getProductById: ${err}`;
    }
  };

  addCart = async (data) => {
    try {
      if (!Carts.#objEmpty(data) && Carts.#verifyRequiredFields(data)) {
        await cartModel.create(data);
        this.status = 1;
        this.statusMsg = "Carrito registrado en bbdd";
      } else {
        console.log("failed");
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

  getCartById = async (id) => {
    try {
      const cart = await cartModel
        .findById(id)
        .populate("products.product")
        .lean();
      this.status = 1;
      return cart;
    } catch (err) {
      this.status = -1;
      this.statusMsg = `getProductById: ${err}`;
    }
  };

  updateProductInCart = async (cartId, productId, updatedProduct) => {
    try {
      const cart = await cartModel.findOne({ _id: cartId });
      if (cart) {
        const productIndex = cart.products.findIndex(
          (prod) => prod._id.toString() === productId
        );

        if (productIndex !== -1) {
          cart.products[productIndex] = {
            ...cart.products[productIndex],
            product: updatedProduct.id
              ? new mongoose.Types.ObjectId(updatedProduct.id)
              : cart.products[productIndex].product,
            quantity: updatedProduct.quantity
              ? updatedProduct.quantity
              : cart.products[productIndex].quantity,
          };

          await cartModel.updateOne(
            { _id: new mongoose.Types.ObjectId(cartId) },
            cart
          );

          console.log("Product updated successfully!");
        } else {
          console.log("Product not found in the cart.");
        }
      } else {
        console.log("Cart not found.");
      }
    } catch (error) {
      this.status = -1;
      this.statusMsg = `updateProductInCart: ${err}`;
    }
  };

  deleteAllCart = async (id) => {
    try {
      const cart = await cartModel.findOneAndDelete({ _id: id });
      this.status = 1;
      return cart;
    } catch (err) {
      this.status = -1;
      this.statusMsg = `getProductById: ${err}`;
    }
  };

  deleteProduct = async (cartId, productId) => {
    console.log(cartId, productId);
    try {
      const cartObjectId = new mongoose.Types.ObjectId(cartId);
      const productObjectId = new mongoose.Types.ObjectId(productId);
      const deleteProduct = await cartModel.updateOne(
        { _id: cartObjectId },
        { $pull: { products: { _id: productObjectId } } }
      );
      if (deleteProduct.modifiedCount === 1) {
        console.log("Product deleted");
      } else {
        console.log("Product not found");
      }
      this.status = 1;
      return deleteProduct;
    } catch (err) {
      this.status = -1;
      this.statusMsg = `getProductById: ${err}`;
    }
  };
}
