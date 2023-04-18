import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.products = [];
    this.lastId = 1;
    this.path = path;
  }

  addProducts(
    title,
    description,
    price,
    thumbnail = [],
    code,
    status = true,
    category,
    stock
  ) {
    const newProduct = {
      id: this.lastId,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      status: status,
      category: category,
      stock: stock,
    };
    let stat;

    // if(Object.values(product).some(value => !value))
    // No sirve porque puedo tener un producto con stock 0 y me lo evalua en false
    // Faltarian algunas validaciones por ejemplo que no sea: false, true, NaN, etc.
    if (
      Object.values(newProduct).some(
        (value) =>
          value === undefined || value === null || value === "" || value < 0
      )
    ) {
      stat = {
        stat: 400,
        msg: `Todos los campos son obligatorios y los valores numericos deben ser positivos o 0.
      No se pudo agregar ${newProduct.title} ${newProduct.description} a la lista`,
      };
    }

    const checkCode = this.products.find(
      (product) => product.code === newProduct.code
    );
    if (checkCode) {
      stat = {
        stat: 400,
        msg: `Ya hay un producto con ese codigo: ${newProduct.code}`,
      };
    } else {
      this.products.push(newProduct);
      this.lastId++;
      this.saveProductsToFile();
      stat = { stat: 200, msg: `Producto agregado correctamente` };
    }
    return stat;
  }

  saveProductsToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }

  getProducts() {
    const allProducts = JSON.parse(fs.readFileSync(this.path, "utf8"));
    return allProducts;
  }

  getProductById(id) {
    const allProducts = JSON.parse(fs.readFileSync(this.path, "utf8"));
    const product = allProducts.find((product) => product.id === id);
    let status;
    if (product) {
      status = {
        stat: 200,
        msg: `Producto con el id ${id}: ${JSON.stringify(product)}`,
      };
    } else {
      status = { stat: 400, msg: `No hay producto con el id: ${id}` };
    }
    return status;
  }

  updateProduct(id, updatedProperties) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    let status;
    if (productIndex !== -1) {
      const productModified = {
        ...this.products[productIndex],
        ...updatedProperties,
      };
      this.products[productIndex] = productModified;
      this.saveProductsToFile();
      status = { stat: 200, msg: `Producto modificado correctamente` };
    } else {
      status = {
        stat: 400,
        msg: `No se puede actualizar, no hay producto con el id: ${id}`,
      };
    }
    return status;
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    let status;
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveProductsToFile();
      status = { stat: 200, msg: `Producto eliminado correctamente` };
    } else {
      status = {
        stat: 400,
        msg: `No se puede borrar, no hay producto con el id: ${id}`,
      };
    }
    return status;
  }
}
