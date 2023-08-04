import Server from './classes/server';
import bodyParser from 'body-parser';
import cors from 'cors';



import router from './routes/router';
import empleado from './routes/empleado';
import usuario from './routes/usuario';
import planilla from './routes/planilla';
import adjunto from './routes/adjuntos';
import basico from './routes/basicos';

const server = Server.instance;
// BodyParser
server.app.use( bodyParser.urlencoded({ extended: true }) );
server.app.use( bodyParser.json() );

// CORS
server.app.use( cors({ origin: true, credentials: true  }) );

// Rutas de servicios
server.app.use('/', router );
server.app.use('/empleados', empleado);
server.app.use('/usuarios', usuario);
server.app.use('/planillas', planilla);
server.app.use('/adjuntos', adjunto);
server.app.use('/basicos', basico);


server.start( () => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});


