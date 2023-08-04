import { Router, Request, Response } from 'express';

const analisis = require('../classes/analisis')

import { connection } from '../global/environment';



const planilla = Router();

planilla.get('/savePlanilla/:tipo/:user', (req:Request, res:Response)=>{
    const {tipo, user } = req.params
    const fecha:any = req.body
    console.log(fecha.fecha);
    analisis.Planilla(tipo, user, fecha).then((msg:any)=>{
        res.status(200).json({
            ok:true
        });
    });
});

var Fin: number = 0;
var DataPrecarga:any = [];
var DataCarga:any = [];
var PageArray: number = 0;
var Inicio:number = 0;
var Pages: number = 1;

planilla.post('/planillas', (req: any, res: any, next:any) => {
    console.log(req.body);
    const {tipo, fecha1, fecha2} = req.body;
    analisis.mostrarPlanilla(tipo, fecha1, fecha2).then((msg:any)=>{
        if(msg.ok) {
            // console.log(msg.registros);
            res.status(200).json({
               ok: true,
               cont: msg.contPlanilla,
               registros: msg.registros
            });
      }
    });
});

planilla.post('/planillas_Resumen', (req: any, res: any, next:any) => {
    const {tipo, fecha1, fecha2} = req.body;
    console.log(req.body);
    analisis.ResumenPlanilla(tipo, fecha1, fecha2).then((msg:any)=>{
        if(msg.ok) {
            //console.log(msg.registros);
            res.status(200).json({
               ok: true,
               registros: msg.registros
            });
      }
    });
});


export default planilla;