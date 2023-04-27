import express from "express";
import dotenv from "dotenv";
import products from "./routes/products.js";
import carts from "./routes/carts.js";
import { engine } from "express-handlebars";
import { ProductManager } from "./modules/product-manager.js";
import { CartManager } from "./modules/cart-manager.js";

const app = express();
app.use(express.json());
dotenv.config({ path: "./src/config/config.env" });
const PORT = process.env.PORT || 8080;

app.use("/api/carts", carts);
app.use("/api/products", products);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

const PATH = "./src/files/productos.json";
const CARTPATH = "./src/files/carritos.json";
export const productsManager = new ProductManager(PATH);
export const cartManager = new CartManager(CARTPATH);
productsManager.addProducts(
  "Fideos",
  "En paquete",
  50,
  undefined,
  12,
  true,
  "Alimento",
  5
);
productsManager.addProducts(
  "Polenta",
  "En bolsa",
  70,
  undefined,
  23,
  true,
  "Alimento",
  10
);
productsManager.addProducts(
  "Arroz",
  "En caja",
  100,
  undefined,
  34,
  true,
  "Alimento",
  30
);
productsManager.addProducts(
  "Tomates",
  "En lata",
  150,
  undefined,
  8,
  false,
  "Alimento",
  2
);

// app.get("/api/products", (req, res) => {
//   res.render("index", {
//     products: products,
//   });
// });

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en ${process.env.NODE_ENV} en puerto ${PORT}`
  );
});
