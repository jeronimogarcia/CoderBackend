// Callbacks
let lecturas = [21, 20, 21, 22, 24, 23, 24, 25, 22, 21, 20];

const LIMITE = 22;
let elementosExcedidos = 0;

lecturas.map((lectura) => lectura > LIMITE && elementosExcedidos++);

console.log(`Elementos excedidos: ${elementosExcedidos}`);

/* ---------- */

const sumar = (n1, n2) => n1 + n2;
const restar = (n1, n2) => n1 - n2;
const multiplicar = (n1, n2) => n1 * n2;
const dividir = (n1, n2) => n1 / n2;
const ejecutar = (n1, n2, cb) => {
  const resultado = cb(n1, n2);
  console.log(resultado);
};

ejecutar(3, 5, sumar);

// Promises

const dividirPromise = (dividendo, divisor) => {
  return new Promise((resolve, reject) => {
    if (divisor === 0) {
      reject("No se puede dividir por 0");
    } else {
      resolve(dividendo / divisor);
    }
  });
};

console.log(dividirPromise(5, 5));

dividirPromise(7, 1)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log("Promesa finalizada");
  });

//

const sumarP = (n1, n2) => {
  return new Promise((res, reject) => {
    // if(n1 && n2)
    if (n1 !== 0 && n2 !== 0) {
      res(n1 + n2);
    } else {
      reject("Operacion no valida");
    }
  });
};

sumarP(4, 0)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
