"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.SERVER_PORT = void 0;
const mysql = require('mysql2');
exports.SERVER_PORT = Number(process.env.PORT) || 5800;
// export const connection = mysql.createConnection({
//     host: 'localhost', // Localhost,  35.202.222.43
//     user: 'root', // root
//     password: 'Caramel-2020', // Ceutec-19, systemas 
//     database: 'jugadores' //
// });
exports.connection = mysql.createConnection({
    host: 'jugadores.cqezygy3ehcy.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Caramel-2020',
    database: 'jugadores' //
});
