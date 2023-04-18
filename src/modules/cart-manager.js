import fs from "fs";

export class CartManager {
  constructor(path) {
    this.carts = [];
    this.lastId = 1;
    this.path = path;
  }

  addCart(products) {
    const newCart = {
      id: this.lastId,
      products: products,
    };
    this.carts.push(newCart);
    this.lastId++;
    this.saveCartToFile();
    let stat = { stat: 200, msg: `Carrito agregado correctamente` };
    return stat;
  }

  getCartById(id) {
    const carts = JSON.parse(fs.readFileSync(this.path, "utf8"));
    const cart = carts.find((cart) => cart.id === id);
    let status;
    if (cart) {
      status = {
        stat: 200,
        msg: `Carrito con el id ${id}: ${JSON.stringify(cart)}`,
      };
    } else {
      status = { stat: 400, msg: `No hay carrito con el id: ${id}` };
    }
    return status;
  }

  updateProductById(cid, pid, newProduct) {
    const carts = JSON.parse(fs.readFileSync(this.path, "utf8"));
    this.carts = carts;
    const findCartIndex = carts.findIndex((cart) => cart.id === cid);
    let status;
    if (findCartIndex !== -1) {
      const findProductIndex = carts[findCartIndex].products.findIndex(
        (product) => product.id === pid
      );
      if (findProductIndex !== -1) {
        const productModified = {
          ...this.carts[findCartIndex].products[findProductIndex],
          quantity:
            this.carts[findCartIndex].products[findProductIndex].quantity + 1,
        };
        this.carts[findCartIndex].products[findProductIndex] = productModified;
        status = {
          stat: 200,
          msg: `Se agrego una copia mas del producto al carrito`,
        };
      } else {
        this.carts[findCartIndex].products.push(newProduct);
        status = { stat: 200, msg: `Se agrego el nuevo producto al carrito` };
      }
    } else {
      status = { stat: 400, msg: `No hay carrito con el id: ${cid}` };
    }
    this.saveCartToFile();
    return status;
  }

  saveCartToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts));
  }
}
