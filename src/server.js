import express from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose'
import axios from "axios";
import { engine } from "express-handlebars";
import { Server } from "socket.io";

import smallProducts from "./routes/smallProducts.js";
import chatMessages from "./routes/chatMessages.js";
import productsManager from './routes/smallProductsManager.js'
import users from "./routes/users.js";
import cart, { cartManager } from "./routes/cart.js";

import mainRoutes from "./routes/main.routes.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from 'connect-mongo';

// Variables de entorno
dotenv.config({ path: "./src/config/config.env" });
const PORT = process.env.PORT || 3000;
const WSPORT = process.env.WS_PORT;
const MONGO_URL = process.env.MONGODB_URL
const SECRET = process.env.COOKIESECRET
const SESSIONSECRET = process.env.SESSIONSECRET
const BASE_URL = 'http://localhost:3000'
                         
// Servidores
const app = express();

const httpServer = app.listen(WSPORT, () => {
  console.log(`Servidor socketio iniciado en puerto ${WSPORT}`);
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: false
}
});

// Parseo de cookies
app.use(cookieParser(SECRET))

// Manejo de sessions
// app.use(session({secret: SESSIONSECRET, resave: true, saveUninitialized: true}))

// Store
const store = MongoStore.create({ mongoUrl: MONGO_URL, mongoOptions: {}, ttl: 30000 });
app.use(session({
  store: store,
  secret: SESSIONSECRET,
  resave: false,
  saveUninitialized: false
}))

// Endpoints
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', mainRoutes(io, store, BASE_URL));
app.use("/api/products", smallProducts);
app.use("/api/manager", productsManager);
app.use("/api/chat", chatMessages);
app.use("/api/carts", cart);
app.use("/api/users", users);

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


// Conexion a la base de datos y sv
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
    try {
      await axios.post('http://localhost:3000/api/manager/addProduct', newProduct);
      socket.emit("updateTable");
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("deleteSmallProduct", async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/manager/${id}`);
      socket.emit("updateTable");
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("updateProduct", async (id, updatedProduct) => {
    try {
      await axios.put('http://localhost:3000/api/manager/update', {id, updatedProduct});
      socket.emit("updateTable");
    } catch (error) {
      console.error(error);
    }
  });
  socket.on('msg', async(data) => {
    await chatManager.addMsg({...data, created: new Date()})
    io.emit('msgUpdate', data)
  })
  socket.on('cart', async (list) => {
    try {
      await axios.post('http://localhost:3000/api/carts/addCart', { products: list });
    } catch (error) {
      console.error(error);
    }
  });
  socket.on('updateProductCart', async(cartId, productId, updatedProduct) => {
    await cartManager.updateProductInCart(cartId, productId, updatedProduct)
    socket.emit("updateCartTable");
  })
  socket.on('deleteProduct', async(cartId, productId) => {
    await cartManager.deleteProduct(cartId, productId)
    socket.emit("updateCartTable");
  })
  socket.on('deleteAllCart', async(cartId) => {
    await cartManager.deleteAllCart(cartId)
    socket.emit("redirect");
  })
});
