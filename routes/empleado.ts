import { Router, Request, Response } from 'express';
import { connection } from '../global/environment';

const archivo = require('../classes/archivos');
const analisis = require('../classes/analisis');

const empleado = Router();

// >>>>>> CARGA DE FEHCA ACTUAL >>>>>>>> 
var fecha = new Date();
var dia = fecha.getDate();
var mes = fecha.getMonth() + 1;
var ano = fecha.getFullYear();
var fechalocal = dia + '/' + mes + '/' + ano;
var fechainter = ano + '-' + mes + '-' + dia
// >>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>

var jugadores:any = [];
var countJugadores:number=0
var PageArray: number = 0 
var Inicio:number = 0
var Fin: number = 0;
var Pages: number = 1;
var TickePreCarga:any = [];
var EmpleadosCargados:any = [];


function precargarjugadores() {
    console.log("Cargando Jugadores");
    const queryString = `SELECT jugador.Id_jugador, jugador.Nombre, jugador.Apellido, jugador.cedula, 
                          date_format(jugador.f_nacimiento, "%Y-%m-%d") as f_nacimiento , jugador.equipo, jugador.cod_carnet,
                          date_format(jugador.f_altas, "%Y-%m-%d") as f_altas,  date_format(jugador.f_baja, "%Y-%m-%d") as f_baja, 
                          jugador.contacto, equipos.Id_equipo, equipos.nombre_equipo as nomEquipo 
                          FROM jugadores.jugador 
                          INNER JOIN jugadores.equipos  ON jugador.equipo = equipos.Id_equipo`
    connection.query(queryString, (err:any, rows:any, fields:any) => {
        if( err ){
            console.log("Se a Sucitado un Error en la Carga de todos los Jugadores");
        }else {
            if(rows.length> 0){
                jugadores = rows
                countJugadores = rows.length
                console.log("Datos Cargados Jugadores");
            }
        }
    });
}

// ==============================================================================================================================================
empleado.post('/addjugador', (req:Request, res:Response)=>{
    const valor = req.body;
    archivo.InsertarJugadores(valor).then((msg:any)=>{
        
        res.status(200).json({
            ok: true
        });
        precargarjugadores();
    });
});

empleado.post('/buscarjugador', (req:Request, res:Response)=>{
    precargarjugadores();
    let result:any = [];
    const valor = String(req.body.valor);
    console.log(valor);

    jugadores.forEach( (e:any) => {
        if( e.Nombre.includes( valor.toUpperCase() ) ){
            result.push( e );
        }
    });
    setTimeout(()=>{
        if( result.length > 0 ) {
            res.status(200).json({
                ok: true,
                registros: result
            });
        }else {
            jugadores.forEach( (e:any) => {
                if( e.Apellido.includes( valor.toUpperCase() ) ){
                    result.push( e );
                }
            });
            setTimeout(()=>{
                res.status(200).json({
                    ok: true,
                    registros: result
                });
            },2000);
        }
    },1000);
});

empleado.get('/jugadores/:Fin', (req:Request, res:Response)=>{
    precargarjugadores();
    console.log("Enviando Data");
    Fin = Number(req.params.Fin);
    if(jugadores.length > 0 ) {

          PageArray =  Math.ceil(Number(jugadores.length / Fin ));
          EmpleadosCargados = jugadores.slice(0, Fin);
          res.status(200).json({
             ok: true,
             TotPages: PageArray,
             registros: EmpleadosCargados
          });
          Pages = 1;
          Inicio = 0;
          console.log("Paginas a Mostrar son " + PageArray);
    }
});

empleado.get('/refecencia/:ref', (req: any, res: any, next:any) => {
    console.log(req.params);
    const ref = req.params.ref;
    if(jugadores.length > 0 ) {
          if ( ref === 'mas' ){
            if( PageArray != 1 ){
                Inicio += 40;
                Fin += 40;
                PageArray -= 1;
                Pages += 1;

                console.log(`Referencia de Num. Reg entre los Parametros ${Inicio}  ${Fin}`);
            } else {
              console.log("Maximo de Registros Mostrados");
            }
          }
          if ( ref === 'menos' ){
            if( Inicio == 0 ){
              console.log("Inicio de la PAgina");
            } else{
              Inicio -= 40;
              Fin -= 40;
              PageArray += 1;
              Pages -= 1;
            }
          }
           var Data = [];
           Data =  jugadores.slice(Inicio, Fin);
           res.status(200).json({
                ok: true,
                TotPages: PageArray,
                pages: Pages,
                registros: Data
           });
    }
});

empleado.get('/unjugador/:id', (req:Request, res:Response)=>{
    precargarjugadores();
    const id= req.params.id
    var Data = []
    //console.log(Empleados[0]);
    Data = jugadores.find( (e:any)=>{
        return e.Id_jugador == id
    });
    // console.log(Data);
    if(Data) {
        res.status(200).json({
            ok: true,
            registros: Data
        })
    } else {
        res.status(200).json({
            ok: false
        })
    }

});

empleado.get('/getUltmId', (req:Request, res:Response)=>{
    analisis.getUltimoId().then((msg:any)=>{
        res.status(200).json({
            ok: true,
            registros: msg.registro
        });
    });
});

empleado.put('/putjugador', (req:Request, res:Response) => {
    const data = req.body;
            archivo.ModificarJugador(data).then((msg:any)=>{
                if(msg.ok){
                    res.status(200).json({
                        ok: true
                    });
                }else {
                    res.status(200).json({
                        ok: false
                    });
                }
            });
}); // 

empleado.get('/jugadorXEquipo/:equipo', (req:Request, res:Response)=>{
    const equipo = req.params.equipo
    var Lista:any = []
    precargarjugadores()

    setTimeout(()=>{
        var i=0
        jugadores.forEach((e:any) => {
            if( e.equipo == equipo ){
                Lista.push(e)
            }
            if( i == countJugadores ){
                res.status(200).json({
                    ok: true,
                    registros: Lista
                });
            }
            i++;
        });
    },100);
});

export default empleado;
