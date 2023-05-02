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

http://localhost:3000 Se visualiza la tabla de productos
http://localhost:3000/realtimeproducts Se realiza conexion con socket.io de forma bilateral. Se pueden agregar productos a la lista y se actualizara de forma automatica.

## Files

Se trabajo con fs para la permanencia de archivos. Borrar productos.json o carritos.json de ./src/files si es necesario.

## Routes

### products

Obtención de la lista de productos con o sin limite
Si no hay limit, trae todos los productos.
GET: /api/products?limit=1

Obtención de producto por id
GET: /api/products/:pid

Agregado de productos. En el body se agrega el objeto, debe respetar el formato del constructor.
POST: /api/products
Ejemplo producto en body:

```bash
{
  "title": "Jamon",
  "description": "Iberico",
  "price": 4500,
  "thumbnail": "undefined",
  "code": 100,
  "status": true,
  "category": "Alimento",
  "stock": 10
}
```

Modificado de propiedad de producto por ID. Se debe pasar en el body un objeto con la key de la property y el valor. Ejemplo:
/api/products/:pid

```bash
{
  "price":200
}
```

Borrado de producto por id
DELETE: /api/products/:pid

### carts

Obtención de carrito por ID
GET: /api/carts/:cid

Agregado de carrito. Se debe pasar lista de producto en el body.
POST: /api/carts
Ejemplo:

```bash
[
  {
    "id": 1,
     "quantity": 5
  },
  {
    "id": 2,
    "quantity": 2
  }
]
```

Agregado de producto a un carrito, pasando ID del carrito y producto en el body. Si el producto ya esta, se suma a la cantidad.
POST: /api/carts/:cid/product
Ejemplo body:

```bash
{
  "id": 3,
  "quantity": 3
}
```
