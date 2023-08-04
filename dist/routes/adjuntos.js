"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs = require('fs');
const fileUpload = require('express-fileupload');
const analisis = require('../classes/analisis');
const leerEx = require('../classes/leerExcel');
const adjunto = (0, express_1.Router)();
adjunto.use(fileUpload());
adjunto.post('/copiaAdjunto/:user', (req, res) => {
    console.log("Recibiendo File");
    let ruta;
    console.log(req.files.files);
    const user = req.params.user;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se Recibio ningun Archivo'
        });
    }
    const name = req.files.files;
    console.log(name["name"]);
    // Guardar Archivos
    ruta = './Archivo/' + name;
    // Use the mv() method to place the file somewhere on your server
    name.mv(ruta, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        setTimeout(() => {
            leerEx.leerexcel(ruta, user).then((msg) => {
                res.status(200).json({
                    ok: true
                });
            });
        }, 2000);
    });
});
adjunto.get('/getAdjuntos', (req, res) => {
    const { tipo, user } = req.params;
    const fecha = req.body;
    console.log(fecha.fecha);
    analisis.Adjuntos().then((msg) => {
        if (msg.ok) {
            res.status(200).json({
                ok: true,
                TotReg: msg.totReg,
                registros: msg.registros
            });
        }
        else {
            res.status(200).json({
                ok: false
            });
        }
    });
});
adjunto.post('/copiaAdjuntoHoras/:user', (req, res) => {
    console.log("Recibiendo File");
    let ruta;
    // console.log(req.files.files);
    const user = req.params.user;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se Recibio ningun Archivo'
        });
    }
    const name = req.files.files;
    console.log(name["name"]);
    // Guardar Archivos
    ruta = './Archivo/' + name;
    // Use the mv() method to place the file somewhere on your server
    name.mv(ruta, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        setTimeout(() => {
            leerEx.leerexcelHoras(ruta, user).then((msg) => {
                res.status(200).json({
                    ok: true
                });
            });
        }, 2000);
    });
});
exports.default = adjunto;
