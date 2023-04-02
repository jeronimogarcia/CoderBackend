// Declaracion de promesa
const dividir = (nro1, nro2) => {
  return new Promise((resolve, reject) => {
    if (nro2 === 0) reject('Division por 0!');
    resolve(nro1 / nro2);
  });
};

// Consumo de promesa con then y catch
const procesar = (n1, n2) => {
  dividir(n1, n2)
    .then((datos) => {
      console.log(datos);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      console.log('Esto debe ejecutarse luego de finalizado el proceso');
    });
};

procesar(2, 0);

// async/await
const procesar2 = async (n1, n2) => {
  const resultado = await dividir(n1, n2);
  console.log(resultado);
};

procesar2(3, 1);

// try/catch

const procesar3 = async (n1, n2) => {
  try {
    const resultado = await dividir(n1, n2);
    console.log(resultado);
  } catch (err) {
    console.log(err);
  }
};

procesar3(4, 1);
