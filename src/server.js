import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import products from "./routes/products.js";
import carts from "./routes/carts.js";
import smallProducts from "./routes/smallProducts.js";
import { ProductManager } from "./modules/product-manager.js";
import { CartManager } from "./modules/cart-manager.js";
import { SmallProductManager } from "./modules/smallProduct-manager.js";
import { smallProductsCreation } from "./utils/smallProductsCreation.js";

// Puertos
dotenv.config({ path: "./src/config/config.env" });
const PORT = process.env.PORT || 3000;
const WS_PORT = 8000;

// Servidores
const app = express();

const httpServer = app.listen(WS_PORT, () => {
  console.log(`Servidor socketio iniciado en puerto ${WS_PORT}`);
});

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// Endpoints
app.use(express.json());
app.use("/api/carts", carts);
app.use("/api/products", products);
app.use("/", smallProducts);

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Products y carts
const PATH = "./src/files/productos.json";
const CARTPATH = "./src/files/carritos.json";
const SMALLPRODUCTSPATH = "./src/files/smallProductos.json";
export const productsManager = new ProductManager(PATH);
export const cartManager = new CartManager(CARTPATH);
export const smallProductsManager = new SmallProductManager(SMALLPRODUCTSPATH);
// try {
//   JSON.parse(fs.readFileSync(PATH, "utf-8"));
// } catch (error) {
//   productsCreation();
// }
try {
  JSON.parse(fs.readFileSync(SMALLPRODUCTSPATH, "utf-8"));
} catch (error) {
  smallProductsCreation();
}


app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en ${process.env.NODE_ENV} en puerto ${PORT}`
  );
});

// Eventos socket.io
io.on("connection", (socket) => {
  console.log('Conexion realizada')
  socket.on("newProduct", (newProduct) => {
    const { name, price, category, stock } = newProduct;
    // console.log(name, price, category, stock);
    smallProductsManager.addProducts(name, price, category, stock);
    const newList = smallProductsManager.getProducts();
    socket.emit("newList", newList);
  });
});
