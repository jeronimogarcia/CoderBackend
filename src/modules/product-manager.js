// TP-Manejo-de-archivos-js
import fs from 'fs';

export class ProductManager {
  constructor(path) {
    this.products = [];
    this.lastId = 1;
    this.path = path;
  }

  addProducts(title, description, price, thumbnail, code, stock) {
    const newProduct = {
      id: this.lastId,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };

    // if(Object.values(product).some(value => !value))
    // No sirve porque puedo tener un producto con stock 0 y me lo evalua en false
    // Faltarian algunas validaciones por ejemplo que no sea: false, true, NaN, etc.
    if (
      Object.values(newProduct).some(
        (value) =>
          value === undefined || value === null || value === '' || value < 0
      )
    ) {
      console.log(
        'Todos los campos son obligatorios y los valores numericos deben ser positivos o 0.',
        `No se pudo agregar ${newProduct.title} ${newProduct.description} a la lista`
      );
      return;
    }

    const checkCode = this.products.find(
      (product) => product.code === newProduct.code
    );
    if (checkCode) {
      console.log(`Ya hay un producto con ese codigo: ${newProduct.code}`);
    } else {
      this.products.push(newProduct);
      this.lastId++;
    }

    this.saveProductsToFile();
  }

  saveProductsToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }

  getProducts() {
    const allProducts = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    console.log('Productos del arhivo:', allProducts);
  }

  getProductById(id) {
    const allProducts = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    const product = allProducts.find((product) => product.id === id);
    if (product) {
      console.log(`Producto con el id: ${id}`, product);
    } else {
      console.log(`No hay producto con el id: ${id}`);
    }
  }

  updateProduct(id, updatedProperties) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex !== -1) {
      const productModified = {
        ...this.products[productIndex],
        ...updatedProperties,
      };
      this.products[productIndex] = productModified;
      this.saveProductsToFile();
    } else {
      console.log(`No se puede actualizar, no hay producto con el id: ${id}`);
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveProductsToFile();
    } else {
      console.log(`No se puede borrar, no hay producto con el id: ${id}`);
    }
  }
}

// const productsManager = new ProductManager('../files/productos.txt');
// productsManager.addProducts('Fideos', 'En paquete', 50, 'urlImg01', 12, 5);
// productsManager.addProducts('Polenta', 'En bolsa', 70, 'urlImg02', 23, 10);
// productsManager.addProducts('Arroz', 'En caja', 100, 'urlImg03', 34, 30);
// productsManager.addProducts('Tomates', 'En lata', 150, 'urlImg04', 8, 2);

// // Error por codigo repetido
// productsManager.addProducts('Alfajores', 'En caja', 20, 'urlImg05', 23, 30);
// // Error por stock negativo
// productsManager.addProducts('Aceitunas', 'En lata', 220, 'urlImg06', 8, -4);
// // Error por campo vacio
// productsManager.addProducts('Manzanas', 'En caja', 280, 9, 20);
// // Actualizado de precio, producto con ID: 2
// productsManager.updateProduct(2, { price: 700 });
// // Obtener producto por ID
// productsManager.getProductById(2);
// // Error al obtener producto por ID inexistente
// productsManager.getProductById(10);
// // Borrado de producto por ID
// productsManager.deleteProduct(3);
// // Intento borrado de producto con ID inexistente
// productsManager.deleteProduct(16);

// productsManager.getProducts();
