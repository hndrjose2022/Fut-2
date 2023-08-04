const XLSX = require('xlsx');
const insert = require('../classes/archivos');

export function leerexcel(ruta:string, cliente?: number) {
    const worbook = XLSX.readFile(ruta);
    const name = ruta.split('/');
    const worbookSheets = worbook.SheetNames;
    return new Promise((resolve, reject) => { 
       const dataExcel = XLSX.utils.sheet_to_json(worbook.Sheets[worbookSheets]);
       insert.InsertarinfoAdjuntos(dataExcel, cliente).then((msg:any) => {
         var mensaje = msg;
         resolve(mensaje);
       });
    });
}

export function leerexcelHoras(ruta:string, cliente?: number) {
  const worbook = XLSX.readFile(ruta);
  const name = ruta.split('/');
  const worbookSheets = worbook.SheetNames;
  return new Promise((resolve, reject) => { 
     const dataExcel = XLSX.utils.sheet_to_json(worbook.Sheets[worbookSheets]);
      
      // resolve({ok : true})
      insert.InsertarHooras(dataExcel, cliente).then((msg:any) => {
        var mensaje = msg;
        resolve(mensaje);
      });


  });
}