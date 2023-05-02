import { productsManager } from '../server.js'
export const productsCreation = () => {
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
  
}