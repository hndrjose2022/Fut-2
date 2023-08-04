import { Router, Request, Response } from 'express';
const bcript = require('bcryptjs');
import { connection } from '../global/environment';

const usuario = Router();

// >>>>>> CARGA DE FEHCA ACTUAL >>>>>>>> 
var fecha = new Date();
var dia = fecha.getDate();
var mes = fecha.getMonth() + 1;
var ano = fecha.getFullYear();
var fechalocal = dia + '/' + mes + '/' + ano;
var fechainter = ano + '-' + mes + '-' + dia
// >>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>
var UsuariosDB:any = []
var Empleados:any = [];
var PageArray: number = 0 
var Inicio:number = 0
var Fin: number = 0;
var TickePreCarga:any = [];
var EmpleadosCargados:any = [];

// ####################################################################
function cargaUsuarios() {
    console.log("Usuarios Cargados");
    const queryString = 'SELECT * FROM usuario'
    connection.query(queryString, (err:any, rows:any, fields:any) => {
        if( err ){
            console.log("Se a Sucitado un Error en la Carga de todos los Usuarios");
        }else {
            if( rows.length>0 ){
                UsuariosDB = rows;
            }
        }
    });
}
cargaUsuarios();
// #####################################################################

usuario.get('/usuario', (req:Request, res:Response)=>{
    if( UsuariosDB.length > 0 ) {
        res.status(200).json({
            ok: true,
            registros: UsuariosDB
        });
    }else {
        res.status(200).json({
            ok: false,
            mensaje: "Hay inconvenientes con La carga de Usuarios"
        });
    }
});

//Agregar Usuario
usuario.post('/crearusuario', (req: any, res: any) => {
    console.log("Tratando de crear un usuario nuevo..")
    const { user, passd, roles } = req.body;
    const salt = bcript.genSaltSync();
    const passEncryp = bcript.hashSync( passd, salt )

    const queryString = "INSERT INTO usuario(usuario, password, roles) VALUES(?, ?, ?)"
    connection.query(queryString, [user, passEncryp, roles], (err: any, results: any, fields:any) => {
        if (err) {
            console.log("Error al agregar nuevo Usuario: " + err)
            res.sendStatus(500)
            return
        }
        res.status(200).json({
            ok: true,
            registros: results.InsertId
        });
        setTimeout(()=>{
            cargaUsuarios();
        },50);
        res.end();

    });
});

usuario.post('/login', (req: any, res: any) => {
    console.log("Logueando");
    cargaUsuarios();
    const { user, pass } = req.body;
    var result = UsuariosDB.find((e:any)=> e.usuario === user );
    // console.log(result);
    if (result) {
        setTimeout(()=>{
            const pasBcryt = bcript.compareSync( pass, result.password );
            if(pasBcryt) {
                res.status(200).json({
                    ok: true,
                    registros: result
                });
             }else {
                res.status(200).json({
                    ok: false,
                    registros: []
                });
             }
        },500);
    }else {
        res.status(200).json({
            ok: false,
            registros: []
        });
    }

});


export default usuario;