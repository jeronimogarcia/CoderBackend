# Coderhouse Backend

## Installation and running

Clone the repository

```bash
npm install
```

```bash
npm run dev
```

El servidor corre en el puerto 3000 (http://localhost:3000)
El servidor http corre en el puerto 8000

## 
http://localhost:3000 Se visualiza la tabla de productos y se puede crear el carrito mandandolo a la BBDD

## 
http://localhost:3000/realtimeproducts  Manager de productos. Agregado, edicion y delete.

## 
http://localhost:3000/api/chat Chat con websocket

## 
http://localhost:3000/allCarts Vista con la tabla de Id de los carritos y redireccion a la vista del carrito

## 
http://localhost:3000/allCarts/:cartId Vista del carrito. Edicion de productos del carrito (cantidad, producto o ambos), eliminacion de producto o eliminacion de carrito completo. 

