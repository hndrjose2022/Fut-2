import { Router, Request, Response } from 'express';
const fs = require('fs');
const fileUpload = require('express-fileupload');

const analisis = require('../classes/analisis');
const leerEx = require('../classes/leerExcel');

import { connection } from '../global/environment';



const adjunto = Router();
adjunto.use(fileUpload());

adjunto.post('/copiaAdjunto/:user', ( req: any, res: Response ) => {
    console.log("Recibiendo File");
    let ruta: string;
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
    name.mv(ruta, (err:any) => {
        if (err) {
          return res.status(500).send(err);
        }
        setTimeout( () => {
            leerEx.leerexcel(ruta, user).then((msg:any) => {
              res.status(200).json({
                ok: true
              });
            });
        },2000);
    });
});

adjunto.get('/getAdjuntos', (req:Request, res:Response)=>{
  const {tipo, user } = req.params
  const fecha:any = req.body
  console.log(fecha.fecha);
  analisis.Adjuntos().then((msg:any)=>{
    if( msg.ok ){
      res.status(200).json({
        ok:true,
        TotReg: msg.totReg,
        registros: msg.registros
      });
    }else {
      res.status(200).json({
        ok:false
      });
    }
  });
});

adjunto.post('/copiaAdjuntoHoras/:user', ( req: any, res: Response ) => {
  console.log("Recibiendo File");
  let ruta: string;
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
  name.mv(ruta, (err:any) => {
      if (err) {
        return res.status(500).send(err);
      }
      setTimeout( () => {
          leerEx.leerexcelHoras(ruta, user).then((msg:any) => {
            res.status(200).json({
              ok: true
            });
          });
      },2000);
  });
});

export default adjunto;