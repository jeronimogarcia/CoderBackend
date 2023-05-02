import fs from "fs";

export class SmallProductManager {
  constructor(path) {
    this.path = path;

    let localProducts;
    let lastId;
    try {
      localProducts = JSON.parse(fs.readFileSync(path, "utf-8"));
      const ids = localProducts.map(p => p.id)
      lastId = Math.max(...ids) + 1
    } catch (error) {
      localProducts = [];
      lastId = 1
    }
    this.lastId = lastId;
    this.products = localProducts;
  }

  addProducts(title, price, category, stock) {
    const newProduct = {
      id: this.lastId,
      title: title,
      price: price,
      category: category,
      stock: stock,
    };
    let stat;

    if (
      Object.values(newProduct).some(
        (value) =>
          value === undefined || value === null || value === "" || value < 0
      )
    ) {
      stat = {
        stat: 400,
        msg: `Todos los campos son obligatorios y los valores numericos deben ser positivos o 0.
      No se pudo agregar ${newProduct.title} a la lista`,
      };
    }

    const checkId = this.products.find(
      (product) => product.id === newProduct.id
    );
    if (checkId) {
      console.log(checkId)
      stat = {
        stat: 400,
        msg: `Ya hay un producto con ese id: ${newProduct.id}`,
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
