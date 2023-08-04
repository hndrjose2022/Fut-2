"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcript = require('bcryptjs');
const environment_1 = require("../global/environment");
const usuario = (0, express_1.Router)();
// >>>>>> CARGA DE FEHCA ACTUAL >>>>>>>> 
var fecha = new Date();
var dia = fecha.getDate();
var mes = fecha.getMonth() + 1;
var ano = fecha.getFullYear();
var fechalocal = dia + '/' + mes + '/' + ano;
var fechainter = ano + '-' + mes + '-' + dia;
// >>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>
var UsuariosDB = [];
var Empleados = [];
var PageArray = 0;
var Inicio = 0;
var Fin = 0;
var TickePreCarga = [];
var EmpleadosCargados = [];
// ####################################################################
function cargaUsuarios() {
    console.log("Usuarios Cargados");
    const queryString = 'SELECT * FROM usuario';
    environment_1.connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Se a Sucitado un Error en la Carga de todos los Usuarios");
        }
        else {
            if (rows.length > 0) {
                UsuariosDB = rows;
            }
        }
    });
}
cargaUsuarios();
// #####################################################################
usuario.get('/usuario', (req, res) => {
    if (UsuariosDB.length > 0) {
        res.status(200).json({
            ok: true,
            registros: UsuariosDB
        });
    }
    else {
        res.status(200).json({
            ok: false,
            mensaje: "Hay inconvenientes con La carga de Usuarios"
        });
    }
});
//Agregar Usuario
usuario.post('/crearusuario', (req, res) => {
    console.log("Tratando de crear un usuario nuevo..");
    const { user, passd, roles } = req.body;
    const salt = bcript.genSaltSync();
    const passEncryp = bcript.hashSync(passd, salt);
    const queryString = "INSERT INTO usuario(usuario, password, roles) VALUES(?, ?, ?)";
    environment_1.connection.query(queryString, [user, passEncryp, roles], (err, results, fields) => {
        if (err) {
            console.log("Error al agregar nuevo Usuario: " + err);
            res.sendStatus(500);
            return;
        }
        res.status(200).json({
            ok: true,
            registros: results.InsertId
        });
        setTimeout(() => {
            cargaUsuarios();
        }, 50);
        res.end();
    });
});
usuario.post('/login', (req, res) => {
    console.log("Logueando");
    cargaUsuarios();
    const { user, pass } = req.body;
    var result = UsuariosDB.find((e) => e.usuario === user);
    // console.log(result);
    if (result) {
        setTimeout(() => {
            const pasBcryt = bcript.compareSync(pass, result.password);
            if (pasBcryt) {
                res.status(200).json({
                    ok: true,
                    registros: result
                });
            }
            else {
                res.status(200).json({
                    ok: false,
                    registros: []
                });
            }
        }, 500);
    }
    else {
        res.status(200).json({
            ok: false,
            registros: []
        });
    }
});
exports.default = usuario;
