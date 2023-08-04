const fs = require('fs');
var fecha = new Date();
var fechArchivodia = '';
var fechArchivo = '';
var dia = fecha.getDate();
var mes = fecha.getMonth() + 1;
var ano = fecha.getFullYear();
var horaSys = fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
var diaC = '';
var mesC = '';
var PasosEstados:any = [];
var FormatFecha: any = [{'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05','jun': '06', 'jul': '07', 
                         'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12'}];

                         var fecha2 = ''
                         var fechaSys = ''
                         if(Number(dia) <= 9) {
                           diaC = '0'+ dia;
                         }else {
                           diaC = String(dia)
                         }
                         
                         if (Number(mes) <= 9) {
                           mesC = '0' + mes; 
                         } else {
                           mesC = String(mes)
                         }
                         
                         fecha2 = diaC + '/' + mesC + '/' + ano 
                         
                         fechaSys = ano + '-' + mesC + '-' + diaC 
                         
// Conexion a la Base de Datos
import { connection } from '../global/environment';


// =====================================================================================================================================================
// ===========================================================  Adjuntos ==============================================================================
// =====================================================================================================================================================
function EliminarAdjuntos() {
  console.log("Eliminando Registro");
  const queryString = `DELETE FROM empleado.adjunto_tran`
  connection.query(queryString, (err:any, res:any, fields:any) => {
      if( err ){
          console.log("Se a Sucitado un Error al Eliminar los Registros");
      }else {
          console.log("Registros Eliminados");
         return true;
      }
  });
}

export function InsertarinfoAdjuntos(valor: any, cliente: number ) {
        EliminarAdjuntos();
        const codcliente =  cliente;
        const mensaje = "Ha Finalizado el proceso de Incertado";
        const status = 'N';
        var x = 1;
        console.log(valor[0]);
        return new Promise((resolve, reject) => {
          var i = 0;
          var count = valor.length;

          var id = setInterval(()=>{
              const queryString5 = `INSERT INTO adjunto_tran(Id_Empleado, Trabajado, H25, H50, H75, H100, Vacacion, Inca_34, Inca_100, Alimentacion, Ajustes, Transporte, Bono_Escolar, Bono_Prod, Maternidad, Otras_Dedu, Imp_Municipal, Optica, Imp_SRenta, Ausencias, Faltas, Permisos) 
                  VALUES(${valor[i].Idempleado}, ${valor[i].DiaTrab}, ${valor[i].H_25},  ${valor[i].H_50},  ${valor[i].H_75}, ${valor[i].H_100}, ${valor[i].Vacaciones}, 
                         ${valor[i].incapasidad34}, ${valor[i].incapasidad100}, ${valor[i].Alimentacion}, ${valor[i].Ajustes}, ${valor[i].Transporte}, ${valor[i].Bono_Escolar}, ${valor[i].Bono_Prod}, ${valor[i].Maternidad}, ${valor[i].Otras_Dedu}, ${valor[i].Imp_Municipal}, ${valor[i].Optica}, ${valor[i].Imp_SRenta},  ${valor[i].Ausencias}, ${valor[i].Faltas}, ${valor[i].Permisos})`;
                  connection.query(queryString5,  (err: any, results: any, fields:any) => {
                      if (err) {
                           console.log("Error al agregar nuevo rgistro: " + err);
                      } 
                      console.log("incertado");
                  
                  });
                  if( i == count-1  ){
                    clearInterval(id);
                    resolve( {ok: true} );
                  }
                  i++;
          },350);
        });
}

export function InsertarPlanilla(valor: any, user?: number) {
  return new Promise((resolve, reject) => {
    var i = 0;
    var count = valor.length; // 34

    var id = setInterval(()=>{
      //console.log(valor[i]);
        //console.log(valor[i].Id + ' ' + valor[i].Total + ' ' +  valor[i].fecha1 + ' al ' + valor[i].fecha2);
        const queryString5 = `INSERT INTO planillas(Id_Empleado, Id_Depto, Id_Puesto, trabajado, Ausencias, Permisos, Faltas, SalXhor, devengado, 
                                                    H_25, T25, H_50, T50, H_75, T75, H_100, T100, T_Extras, 
                                                    Ajustes, Transporte, Bono_Prod, Bono_Escolar, Vacaciones, inca34, inca100, Incapasidad, Maternidad, Alimentacion, TotalExtraordinario, 
                                                    IHSS, Otras_Dedu, Imp_Municipal, Optica, Imp_SRenta, TotalDeducciones, 
                                                    TotalPagar, Tipo, FechaIni, FechaFin) 
            VALUES(${valor[i].Id}, ${valor[i].Depto}, ${valor[i].puesto}, ${valor[i].trabajado}, ${valor[i].Ausencias}, ${valor[i].Permisos}, ${valor[i].Faltas}, ${valor[i].SalXhor}, ${valor[i].devengado},  
                   ${valor[i].h25}, ${valor[i].t25}, ${valor[i].h50}, ${valor[i].t50}, ${valor[i].h75}, ${valor[i].t75}, ${valor[i].h100}, ${valor[i].t100}, ${valor[i].Textras}, 
                   ${valor[i].ajustes}, ${valor[i].Transporte}, ${valor[i].Bono_Prod}, ${valor[i].BonoEscolar}, ${valor[i].Vacaciones}, ${valor[i].Inca34}, ${valor[i].Inca100}, ${valor[i].Incapasidad}, ${valor[i].Maternidad}, ${valor[i].Alimentacion}, ${valor[i].Textraordinario}, 
                   ${valor[i].IHSS}, ${valor[i].Otras_Dedu}, ${valor[i].Imp_Municipal}, ${valor[i].Optica}, ${valor[i].Imp_SRenta}, ${valor[i].TDeduciones}, 
                   ${valor[i].Total}, '${valor[i].Tipo}', '${valor[i].fecha1}', '${valor[i].fecha2}')`;
            connection.query(queryString5,  (err: any, results: any, fields:any) => {
                if (err) {
                     console.log("Error al agregar nuevo rgistro: " + err);
                } 
                console.log("incertado");
            });
            if( i == count-1  ){
              clearInterval(id);
            
              resolve( {ok: true} );
            }
            i++;
    },150);
  });
}

export function InsertarHooras(valor: any, user?: number){
  console.log("Se incertara Horas de Entrada");
  return new Promise((resolve, reject) => {
    var i = 0;
    var count = valor.length;
    var id = setInterval(()=>{
      console.log(valor[i])
      if( i == 10 ){
        clearInterval(id);
      
        resolve( {ok: true} );
      }
      i++;
    },200)
  });
}


// =====================================================================================================================================================
// ===========================================================  EQUIPOS ==============================================================================
// =====================================================================================================================================================
export function InsertarEquipos(valor: any){
  return new Promise((resolve, reject) => {

        const queryString5 = `INSERT INTO equipos(Id_equipo, nombre_equipo) 
                VALUES('${valor.nombre.toUpperCase()}')`;
            connection.query(queryString5,  (err: any, results: any, fields:any) => {
                if (err) {
                     console.log("Error al agregar nuevo rgistro: " + err);
                } 
                console.log("incertado");
                resolve( {ok: true} );
            });
  });
}


// =====================================================================================================================================================
// ===========================================================  JUGADORES ==============================================================================
// =====================================================================================================================================================
export function InsertarJugadores(valor: any){
  return new Promise((resolve, reject) => {
    var i = 0;
      console.log(valor);
        const queryString5 = `INSERT INTO jugador(Nombre, Apellido, cedula, f_nacimiento, equipo, cod_carnet, f_altas, contacto) 
                VALUES('${valor.nombre.toUpperCase()}', '${valor.apellido.toUpperCase()}', '${valor.cedula}', '${valor.fecha_nac}', ${valor.equipo},  
                      '${valor.carnet}', '${valor.f_alta}', '${valor.telefono}')`;
            connection.query(queryString5,  (err: any, results: any, fields:any) => {
                if (err) {
                     console.log("Error al agregar nuevo rgistro: " + err);
                } 
                console.log("incertado");
                resolve( {ok: true} );
            });
  });
}

export function ModificarJugador(valor: any){
  return new Promise((resolve, reject) => {
      const { Id_jugador, nombre, apellido, cedula, f_nacimiento, equipo, carnet, f_alta, f_baja } = valor;

      const queryString5 = `UPDATE jugador SET Nombre= '${nombre.toUpperCase()}', Apellido= '${apellido.toUpperCase()}', cedula= ${cedula}, f_nacimiento= '${f_nacimiento}', equipo= ${equipo}, cod_carnet= '${carnet}', 
                                                    f_altas= '${f_alta}', f_baja= '${f_baja}' WHERE Id_jugador = ${Id_jugador}`;
      connection.query(queryString5,  (err: any, results: any, fields:any) => {
          if (err) {
              console.log("Error al Modificar rgistro: " + err);
          } 
          console.log("Modificado");
          setTimeout(()=>{
            resolve({ok: true});
          },500);
      });
  });
}

export function EliminarJugador(id: number ) {
  console.log("Eliminando Registro");
  const queryString = `DELETE FROM jugador WHERE Id_jugador = ${id}` 
  connection.query(queryString, (err:any, res:any, fields:any) => {
      if( err ){
          console.log("Se a Sucitado un Error al Eliminar los Registros");
      }else {
          console.log("Jugador Eliminado");
         return true;
      }
  });
}