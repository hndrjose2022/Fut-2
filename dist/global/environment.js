"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.SERVER_PORT = void 0;
const mysql = require('mysql2');
exports.SERVER_PORT = Number(process.env.PORT) || 5800;
exports.connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Caramel-2020',
    database: 'jugadores', //
});
// export const connection = mysql.createConnection({
//     host: 'database-jugadores.cqezygy3ehcy.us-east-2.rds.amazonaws.com', // Localhost,  35.202.222.43
//     user: 'admin', // root
//     password: 'Caramel-2020', // Ceutec-19, systemas
//     database: 'jugador', //
// });
