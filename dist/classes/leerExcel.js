"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerexcelHoras = exports.leerexcel = void 0;
const XLSX = require('xlsx');
const insert = require('../classes/archivos');
function leerexcel(ruta, cliente) {
    const worbook = XLSX.readFile(ruta);
    const name = ruta.split('/');
    const worbookSheets = worbook.SheetNames;
    return new Promise((resolve, reject) => {
        const dataExcel = XLSX.utils.sheet_to_json(worbook.Sheets[worbookSheets]);
        insert.InsertarinfoAdjuntos(dataExcel, cliente).then((msg) => {
            var mensaje = msg;
            resolve(mensaje);
        });
    });
}
exports.leerexcel = leerexcel;
function leerexcelHoras(ruta, cliente) {
    const worbook = XLSX.readFile(ruta);
    const name = ruta.split('/');
    const worbookSheets = worbook.SheetNames;
    return new Promise((resolve, reject) => {
        const dataExcel = XLSX.utils.sheet_to_json(worbook.Sheets[worbookSheets]);
        // resolve({ok : true})
        insert.InsertarHooras(dataExcel, cliente).then((msg) => {
            var mensaje = msg;
            resolve(mensaje);
        });
    });
}
exports.leerexcelHoras = leerexcelHoras;
