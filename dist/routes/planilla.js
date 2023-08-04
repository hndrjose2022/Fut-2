"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analisis = require('../classes/analisis');
const planilla = (0, express_1.Router)();
planilla.get('/savePlanilla/:tipo/:user', (req, res) => {
    const { tipo, user } = req.params;
    const fecha = req.body;
    console.log(fecha.fecha);
    analisis.Planilla(tipo, user, fecha).then((msg) => {
        res.status(200).json({
            ok: true
        });
    });
});
var Fin = 0;
var DataPrecarga = [];
var DataCarga = [];
var PageArray = 0;
var Inicio = 0;
var Pages = 1;
planilla.post('/planillas', (req, res, next) => {
    console.log(req.body);
    const { tipo, fecha1, fecha2 } = req.body;
    analisis.mostrarPlanilla(tipo, fecha1, fecha2).then((msg) => {
        if (msg.ok) {
            // console.log(msg.registros);
            res.status(200).json({
                ok: true,
                cont: msg.contPlanilla,
                registros: msg.registros
            });
        }
    });
});
planilla.post('/planillas_Resumen', (req, res, next) => {
    const { tipo, fecha1, fecha2 } = req.body;
    console.log(req.body);
    analisis.ResumenPlanilla(tipo, fecha1, fecha2).then((msg) => {
        if (msg.ok) {
            //console.log(msg.registros);
            res.status(200).json({
                ok: true,
                registros: msg.registros
            });
        }
    });
});
exports.default = planilla;
