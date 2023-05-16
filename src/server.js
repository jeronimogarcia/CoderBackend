import express from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose'
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import smallProducts, { manager } from "./routes/smallProducts.js";

// Puertos
dotenv.config({ path: "./src/config/config.env" });
const PORT = process.env.PORT || 3000;
const WS_PORT = 8000;
const MONGO_URL = process.env.MONGODB || 'mongodb://127.0.0.1:27017'

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
    const newList = await manager.getProducts();
    socket.emit("newList", newList);
  });
});
