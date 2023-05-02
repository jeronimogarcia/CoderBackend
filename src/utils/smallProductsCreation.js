import { smallProductsManager } from '../server.js'
export const smallProductsCreation = () => {
  smallProductsManager.addProducts(
    "Fideos",
    50,
    "Alimento",
    5
  );
  smallProductsManager.addProducts(
    "Polenta",
    70,
    "Alimento",
    10
  );
  smallProductsManager.addProducts(
    "Arroz",
    100,
    "Alimento",
    30
  );
  smallProductsManager.addProducts(
    "Tomates",
    150,
    "Alimento",
    2
  );
}