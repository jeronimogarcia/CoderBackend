import express from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose'
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import smallProducts, { manager } from "./routes/smallProducts.js";
import chatMessages, { chatManager } from "./routes/chatMessages.js";
import cart, { cartManager } from "./routes/cart.js";

// Puertos
dotenv.config({ path: "./src/config/config.env" });
const PORT = process.env.PORT || 3000;
const WS_PORT = 8000;
const MONGO_URL = process.env.MONGODB || 'mongodb+srv://jeroCoder:mFZ9KlmesEUSqrik@codercluster.ygft8c4.mongodb.net/ecommerce'
                         
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
app.use(express.urlencoded({ extended: true }));
app.use("/", smallProducts);
app.use("/api", chatMessages);
app.use("/cart", cart);

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

try {
  await mongoose.connect(MONGO_URL)
  app.listen(PORT, () => {
    console.log(
      `Servidor corriendo en ${process.env.NODE_ENV} en puerto ${PORT}`
    );
  });
} catch (err) {
  console.log(err, 'No se pudo conectar a la bbdd')
}

// Eventos socket.io
io.on("connection", (socket) => {
  console.log('Conexion realizada')
  socket.on("newProduct", async (newProduct) => {
    manager.addProduct(newProduct)
    socket.emit("updateTable");
  });
  socket.on("deleteProduct", async (id) => {
    manager.deleteProduct(id)
    socket.emit("updateTable");
  });
  socket.on("updateProduct", async (id, updatedProduct) => {
    manager.updateProduct(id, updatedProduct)
    socket.emit("updateTable");
  });
  socket.on('msg', async(data) => {
    await chatManager.addMsg({...data, created: new Date()})
    io.emit('msgUpdate', data)
  })
  socket.on('cart', async(list) => {
    await cartManager.addCart({products: list})
  })
  socket.on('updateProductCart', async(cartId, productId, updatedProduct) => {
    await cartManager.updateProductInCart(cartId, productId, updatedProduct)
    socket.emit("updateTable");
  })
  socket.on('deleteProduct', async(cartId, productId) => {
    await cartManager.deleteProduct(cartId, productId)
    socket.emit("updateTable");
  })
  socket.on('deleteAllCart', async(cartId) => {
    await cartManager.deleteAllCart(cartId)
    socket.emit("redirect");
  })
});
