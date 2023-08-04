const mysql = require('mysql2');

export const SERVER_PORT: number = Number( process.env.PORT ) || 5800;



export const connection = mysql.createConnection({
    host: 'localhost', // Localhost,  35.202.222.43
    user: 'root', // root
    password: 'Caramel-2020', // Ceutec-19, systemas
    database: 'jugadores', //
});


// export const connection = mysql.createConnection({
//     host: 'database-jugadores.cqezygy3ehcy.us-east-2.rds.amazonaws.com', // Localhost,  35.202.222.43
//     user: 'admin', // root
//     password: 'Caramel-2020', // Ceutec-19, systemas
//     database: 'jugador', //
// });