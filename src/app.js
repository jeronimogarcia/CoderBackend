import express from 'express';
import fs from 'fs';
import { ProductManager } from './modules/product-manager.js';

const PORT = 8080;
const app = express();
const PATH = './files/productos.json';
const productsManager = new ProductManager(PATH);
productsManager.addProducts('Fideos', 'En paquete', 50, 'urlImg01', 12, 5);
productsManager.addProducts('Polenta', 'En bolsa', 70, 'urlImg02', 23, 10);
productsManager.addProducts('Arroz', 'En caja', 100, 'urlImg03', 34, 30);
productsManager.addProducts('Tomates', 'En lata', 150, 'urlImg04', 8, 2);

app.get('/products', (req, res) => {
  const limit = req.query.limit;
  const products = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  const allProducts = limit ? products.slice(0, limit) : products;
  res.send(allProducts);
});

app.get('/products/:pid', (req, res) => {
  const idProduct = req.params.pid;
  const allProducts = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  const product = allProducts.find(product => product.id === +idProduct);
  if (product) {
    res.send(product);
  } else {
    res.send('No hay producto con ese ID');
  }
});

app.listen(PORT, () => {
  console.log('Servidor corriendo en puerto 8080');
});
