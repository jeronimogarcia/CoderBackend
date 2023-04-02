const fs = require('fs');

const ARCHIVO = './contenido.txt';

fs.readFile(ARCHIVO, 'utf-8', (err, res) => {
  console.log(err ? err : res);
});

fs.appendFileSync(ARCHIVO, 'Mas contenido');
