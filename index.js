// TP-Clases-ECMAScript-ECMAScript-Avanzado

class ProductManager {
  constructor() {
    this.products = [];
    this.lastId = 1;
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

    const checkCode = this.products.find(
      (product) => product.code === newProduct.code
    );
    if (checkCode) {
      console.log(`Ya hay un producto con ese codigo: ${newProduct.code}`);
    } else {
      this.products.push(newProduct);
      this.lastId++;
    }
  }

  getProducts() {
    console.log(this.products);
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      console.log(`Producto con el id: ${id}`, product);
    } else {
      console.log(`No hay producto con el id: ${id}`);
    }
  }
}

const productsManager = new ProductManager();
productsManager.addProducts('Fideos', 'En paquete', 50, 'urlImg01', 12, 5);
productsManager.addProducts('Polenta', 'En bolsa', 70, 'urlImg02', 23, 10);
productsManager.addProducts('Arroz', 'En caja', 100, 'urlImg03', 34, 30);
productsManager.addProducts('Arroz', 'En caja', 20, 'urlImg04', 23, 30);
productsManager.addProducts('Tomates', 'En lata', 150, 'urlImg05', 8, 10);

productsManager.getProducts();
productsManager.getProductById(2);
productsManager.getProductById(10);
