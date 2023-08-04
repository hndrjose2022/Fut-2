"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeEmpleados = exports.getUltimoId = exports.empleados = exports.CalHoras = exports.Adjuntos = exports.ResumenPlanilla = exports.mostrarPlanilla = exports.Planilla = void 0;
const environment_1 = require("../global/environment");
const archivo = require('../classes/archivos');
var EmpleadosDB = [];
var GlobalEmpleadosDB = [];
var AdjuntosDB = [];
var planilla = [];
var Hplanilla = [];
var DeducionesDB;
var adjuntos = [];
// ####################################################################
function cargarEmpleados(tipo) {
    const queryString = `SELECT Id_Empleado, nombre, depto, puesto, salHora, tiposal FROM empleados WHERE planilla = "S" AND tiposal = "${tipo}"`;
    environment_1.connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Se a Sucitado un Error en la Carga de todos los Empleados");
        }
        else {
            if (rows.length > 0) {
                EmpleadosDB = rows;
                // console.log(EmpleadosDB);
            }
        }
    });
}
function cargarGlobalEmpleados() {
    const queryString = `SELECT * FROM empleados`;
    environment_1.connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Error en la Carga de todos los Empleados Global");
        }
        else {
            if (rows.length > 0) {
                GlobalEmpleadosDB = rows;
                // console.log(EmpleadosDB);
            }
        }
    });
}
function cargarAdjutos() {
    const queryString = `SELECT * FROM adjunto_tran`;
    environment_1.connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Se a Sucitado un Error en la Carga de todos los Adjutos Transitorios");
        }
        else {
            if (rows.length > 0) {
                AdjuntosDB = rows;
                //console.log(AdjuntosDB);
            }
        }
    });
}
function cargarDeducionesDB(tipo) {
    const queryString = `SELECT * FROM empleado.deduciondb WHERE  Referencia = '${tipo}'`;
    environment_1.connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Se a Sucitado un Error en la Carga de todos los Adjutos Transitorios");
        }
        else {
            if (rows.length > 0) {
                DeducionesDB = rows[0].valor;
                // console.log(AdjuntosDB);
            }
        }
    });
}
function contarPlanillas(tipo, fecha1, fecha2) {
    return new Promise((resolve) => {
        const query1 = `SELECT count(planillas.Id_Empleado) as numReg FROM planillas 
        WHERE planillas.Tipo = '${tipo}' AND planillas.FechaIni >= '${fecha1}' AND planillas.FechaFin <= '${fecha2}'`;
        // console.log(query1);
        environment_1.connection.query(query1, (err, rows, fields) => {
            if (err) {
                console.log("Se a Sucitado un Error en la Carga de todos los Empleados");
            }
            else {
                if (rows.length > 0) {
                    //console.log(rows);
                    resolve({ reg: rows[0].numReg });
                }
            }
        });
    });
}
function revisarPlanilla(tipo, fecha1, fecha2) {
    const queryString = `DELETE FROM empleado.planillas
                            WHERE Tipo = '${tipo}' AND FechaIni >= '${fecha1}' AND FechaFin <= '${fecha2}'`;
    environment_1.connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Se a Sucitado un Error en la Carga de todos los Adjutos Transitorios");
        }
        else {
            console.log("eliminados Registros de la Planilla del " + fecha1 + '  ' + 'al' + ' ' + fecha2 + ' ' + tipo);
        }
    });
}
// #####################################################################
function Planilla(tipo, user, fecha) {
    cargarEmpleados(tipo);
    cargarDeducionesDB(tipo);
    cargarAdjutos();
    revisarPlanilla(tipo, fecha.fecha1, fecha.fecha2);
    console.log("Iniciando Planilla");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var count = AdjuntosDB.length;
            var i = 0;
            var id = setInterval(() => {
                const { Id_Empleado, Trabajado, H25, H50, H75, H100, Vacacion, Inca_34, Inca_100, Alimentacion, Ajustes, Transporte, Bono_Escolar, Bono_Prod, Maternidad, Otras_Dedu, Imp_Municipal, Optica, Imp_SRenta, Ausencias, Faltas, Permisos } = AdjuntosDB[i];
                // console.log(Id_Empleado);
                function encuentra(Empleado) {
                    return Empleado.Id_Empleado == Id_Empleado;
                }
                let empleado = EmpleadosDB.find((Empleado) => encuentra(Empleado));
                // Salario Devengado
                var devengado = 0;
                var vacaciones = 0;
                var llegadaT = 0;
                if (empleado.tiposal === 'Q') {
                    llegadaT = Number(Ausencias) * Number(empleado.salHora);
                    devengado = ((Number(empleado.salHora) * 8) * Number(Trabajado)) - llegadaT;
                    vacaciones = ((Number(empleado.salHora) * 8) * Number(Vacacion));
                }
                else {
                    var sabado = 0;
                    var domingo = 0;
                    if (empleado.seccion === 'N') {
                    }
                    else {
                        llegadaT = Number(Ausencias) * Number(empleado.salHora);
                        sabado = (Number(empleado.salHora) * 4);
                        domingo = (Number(empleado.salHora) * 8);
                    }
                    if (Faltas > 0) {
                        devengado = ((Number(empleado.salHora) * Number(Trabajado)) + sabado - domingo - llegadaT);
                    }
                    else {
                        devengado = ((Number(empleado.salHora) * Number(Trabajado)) + sabado + domingo) - llegadaT;
                    }
                    vacaciones = (Number(empleado.salHora) * Number(Vacacion));
                    // var DiaVacacion = 
                }
                // Horas Extras
                var H_25 = (Number(empleado.salHora) * Number(H25));
                var H_50 = (Number(empleado.salHora) * Number(H50));
                var H_75 = (Number(empleado.salHora) * Number(H75));
                var H_100 = (Number(empleado.salHora) * Number(H100));
                // Sumar Extras
                var TExtras = (H_25 + H_50 + H_75 + H_100);
                // Sumar Incapacidad
                var inca34 = (Number(Inca_34) * Number(empleado.salHora)) * 0.34;
                var inca100 = Number(Inca_100) * Number(empleado.salHora);
                var TInca = Number(inca34) + Number(inca100);
                // Total Extraordinario
                var ExtraOrdinario = Number(Transporte) + Number(Alimentacion) + Number(Ajustes) + Number(Bono_Escolar) + Number(Bono_Prod) + Number(Maternidad) + Number(TInca) + Number(vacaciones);
                // Sumar Deduciones 
                var DPermiso = Number(Permisos) / 9;
                var Tpermiso = Number(Permisos) * Number(empleado.salHora);
                var Deduciones = Number(Otras_Dedu) + Number(Imp_Municipal) + Number(Optica) + Number(Imp_SRenta) + Number(Tpermiso) + Number(DeducionesDB);
                var Total = (Number(devengado) + Number(TExtras) + Number(ExtraOrdinario)) - Number(Deduciones);
                // Creacion de la Planilla    
                planilla.push({ "Id": Id_Empleado, "Depto": empleado.depto, "puesto": empleado.puesto, "trabajado": Trabajado, "Ausencias": Ausencias, "Permisos": Permisos, "Faltas": Faltas, "SalXhor": empleado.salHora, "devengado": devengado, "h25": H25, "t25": H_25,
                    "h50": H50, "t50": H_50, "h75": H75, "t75": H_75, "h100": H100, "t100": H_100, "Textras": TExtras, "ajustes": Ajustes, "Transporte": Transporte, "Bono_Prod": Bono_Prod,
                    "BonoEscolar": Bono_Escolar, "Vacaciones": vacaciones, "Inca34": Inca_34, "Inca100": Inca_100, "Incapasidad": TInca, "Maternidad": Maternidad, "Alimentacion": Alimentacion, "Textraordinario": ExtraOrdinario,
                    "IHSS": DeducionesDB, "Otras_Dedu": Otras_Dedu, "Imp_Municipal": Imp_Municipal, "Optica": Optica, "Imp_SRenta": Imp_SRenta, "TDeduciones": Deduciones, "Total": Total, "Tipo": empleado.tiposal, "fecha1": fecha.fecha1, "fecha2": fecha.fecha2
                });
                if (i == count - 1) {
                    clearInterval(id);
                    console.log("Creado por el Usuario: " + user);
                    console.log("Procedimeito Finalizado");
                    console.log(planilla[0]);
                    archivo.InsertarPlanilla(planilla, user).then((msg) => {
                        if (msg.ok) {
                            resolve({ ok: true });
                        }
                    });
                }
                i++;
            }, 500);
        }, 3000);
    });
}
exports.Planilla = Planilla;
function mostrarPlanilla(tipo, fecha1, fecha2) {
    console.log("Recibiendo Data");
    return new Promise((resolve) => {
        var regCnt;
        contarPlanillas(tipo, fecha1, fecha2).then((msg) => {
            const queryString = `SELECT planillas.Id_Empleado, CONCAT(empleados.nombre, ' ',  empleados.apellido) as Nombre, departamento.nombre_depto, puesto.nombre_puesto, empleados.salHora,
            empleados.salario, planillas.trabajado, planillas.Ausencias, ROUND(SUM(planillas.Ausencias * empleados.salHora),2) as TollegadaT, planillas.Permisos, ROUND(SUM(planillas.Permisos* empleados.salHora),2) as Tpermiso,
            planillas.faltas, planillas.devengado, planillas.H_25, planillas.T25, planillas.H_50, planillas.T50, planillas.H_75, planillas.T75, planillas.H_100, planillas.T100, 
            planillas.T_Extras, planillas.Ajustes, planillas.Transporte, planillas.Bono_Escolar, planillas.H_Vacacion, planillas.Vacaciones, planillas.inca34, planillas.inca100, planillas.Incapasidad, planillas.Maternidad,
            planillas.Alimentacion, planillas.TotalExtraordinario, planillas.IHSS, planillas.Otras_Dedu, planillas.Optica, planillas.Imp_Municipal, planillas.Imp_SRenta, planillas.TotalDeducciones, planillas.TotalPagar,
            planillas.FechaIni, planillas.FechaFin
            FROM empleado.planillas 
            INNER JOIN empleado.empleados  ON planillas.Id_Empleado = empleados.Id_Empleado
            INNER JOIN empleado.departamento ON planillas.Id_Depto = departamento.Id_depto  
            INNER JOIN empleado.puesto ON planillas.Id_Puesto = puesto.Id_puesto
            WHERE empleados.tiposal = '${tipo}' AND planillas.FechaIni >= '${fecha1}' AND planillas.FechaFin <= '${fecha2}'
            GROUP BY planillas.Id_Empleado, planillas.Id_Depto`;
            environment_1.connection.query(queryString, (err, rows, fields) => {
                if (err) {
                    console.log("Se a Sucitado un Error en la Carga de todos los Empleados");
                }
                else {
                    if (rows.length > 0) {
                        console.log("La Cant de Planilla es: " + msg.reg);
                        resolve({ ok: true, contPlanilla: msg.reg, registros: rows });
                        // console.log(EmpleadosDB);
                    }
                }
            });
        });
    });
}
exports.mostrarPlanilla = mostrarPlanilla;
function ResumenPlanilla(tipo, fecha1, fecha2) {
    console.log("Recibiendo Data");
    return new Promise((resolve) => {
        var query = '';
        query = `SELECT planillas.Tipo, COUNT(planillas.Id_Empleado) AS Num_Empleado, SUM( planillas.devengado) AS To_Devengado,
                    SUM(planillas.T_Extras) AS To_Extras, SUM(planillas.TotalExtraordinario) AS To_Extraordinario, SUM(planillas.TotalDeducciones) AS To_Deducciones,
                    SUM(planillas.TotalPagar) AS To_Paga, planillas.FechaIni, planillas.FechaFin
                    FROM empleado.planillas 
                    WHERE planillas.Tipo = '${tipo}' AND planillas.FechaIni >= '${fecha1}'  AND planillas.FechaFin <= '${fecha2}'
                    GROUP BY planillas.FechaIni, planillas.FechaFin`;
        if (tipo === 'A') {
            query = `SELECT planillas.Tipo, COUNT(planillas.Id_Empleado) AS Num_Empleado, SUM( planillas.devengado) AS To_Devengado,
                        SUM(planillas.T_Extras) AS To_Extras, SUM(planillas.TotalExtraordinario) AS To_Extraordinario, SUM(planillas.TotalDeducciones) AS To_Deducciones,
                        SUM(planillas.TotalPagar) AS To_Paga, planillas.FechaIni, planillas.FechaFin
                        FROM empleado.planillas 
                        GROUP BY planillas.FechaIni, planillas.FechaFin`;
        }
        if (tipo !== 'A' && fecha1 === '') {
            query = `SELECT planillas.Tipo, COUNT(planillas.Id_Empleado) AS Num_Empleado, SUM( planillas.devengado) AS To_Devengado,
                     SUM(planillas.T_Extras) AS To_Extras, SUM(planillas.TotalExtraordinario) AS To_Extraordinario, SUM(planillas.TotalDeducciones) AS To_Deducciones,
                     SUM(planillas.TotalPagar) AS To_Paga, planillas.FechaIni, planillas.FechaFin
                     FROM empleado.planillas
                     WHERE planillas.Tipo = '${tipo}'
                     GROUP BY planillas.FechaIni, planillas.FechaFin`;
        }
        setTimeout(() => {
            const queryString = query;
            environment_1.connection.query(queryString, (err, rows, fields) => {
                if (err) {
                    console.log("Se a Sucitado un Error en la Carga de todos los Empleados");
                }
                else {
                    // console.log(rows);
                    if (rows.length > 0) {
                        resolve({ ok: true, registros: rows });
                        // console.log(EmpleadosDB);
                    }
                }
            });
        }, 300);
    });
}
exports.ResumenPlanilla = ResumenPlanilla;
//  =============================================================================================================================================
// ADJUNTOS
//  =============================================================================================================================================
function Adjuntos() {
    return new Promise((resolve) => {
        var count = 0;
        var regs = [];
        const queryString = `SELECT Count(Id_Empleado) as TotEmplead FROM adjunto_tran`;
        environment_1.connection.query(queryString, (err, rows, fields) => {
            if (err) {
                console.log("Se a Sucitado un Error en la Carga de todos los Adjutos Transitorios");
            }
            else {
                if (rows.length > 0) {
                    count = rows[0].TotEmplead;
                }
            }
        });
        const queryString1 = `SELECT * FROM adjunto_tran`;
        environment_1.connection.query(queryString1, (err, rows, fields) => {
            if (err) {
                console.log("Se a Sucitado un Error en la Carga de todos los Adjutos Transitorios");
            }
            else {
                if (rows.length > 0) {
                    regs = rows;
                }
            }
        });
        setTimeout(() => {
            resolve({ ok: true, totReg: count, registros: regs });
        }, 1000);
    });
}
exports.Adjuntos = Adjuntos;
//  =============================================================================================================================================
// EMPLEADOS
//  =============================================================================================================================================
function CalHoras(valor) {
    return new Promise((resolve) => {
    });
}
exports.CalHoras = CalHoras;
//  =============================================================================================================================================
// EMPLEADOS
//  =============================================================================================================================================
// cargarGlobalEmpleados();
function empleados(tipo) {
    return new Promise((resolve) => {
        var Data = GlobalEmpleadosDB.find((e) => {
            return e.tiposal === tipo;
        });
        setTimeout(() => {
            resolve({ ok: true, registros: Data });
        }, 1000);
    });
}
exports.empleados = empleados;
function getUltimoId() {
    return new Promise((resolve) => {
        const sqlquery = `SELECT MAX(Id_Empleado) as ultimo FROM empleados`;
        environment_1.connection.query(sqlquery, (err, rows, fields) => {
            if (err) {
                console.log("Se a Sucitado un Error en la Carga de todos");
            }
            else {
                if (rows.length > 0) {
                    resolve({ registro: rows[0].ultimo });
                }
            }
        });
    });
}
exports.getUltimoId = getUltimoId;
function likeEmpleados(valor) {
    return new Promise((resolve) => {
        const queryString = `SELECT *, departamento.nombre_depto, puesto.nombre_puesto , empleado_genro.nombre_genero, direc_indirc.nombre_direc
        FROM empleado.empleados 
        INNER JOIN empleado.departamento ON empleados.depto = departamento.Id_depto
        INNER JOIN empleado.puesto ON empleados.puesto = puesto.Id_puesto
        INNER JOIN empleado.empleado_genro ON  empleados.genero = empleado_genro.Id_genero
        INNER JOIN empleado.direc_indirc ON  empleados.dic_indc = direc_indirc.Id_direc
        WHERE empleados.nombre  LIKE '%${valor}%'`;
        environment_1.connection.query(queryString, (err, rows, fields) => {
            if (err) {
                console.log("Se a Sucitado un Error en la Carga de todos los Empleados");
            }
            else {
                if (rows.length > 0) {
                    resolve({ registros: rows });
                    console.log("Datos Encontrados");
                }
                else {
                    const queryString = `SELECT *, departamento.nombre_depto, puesto.nombre_puesto , empleado_genro.nombre_genero, direc_indirc.nombre_direc
                    FROM empleado.empleados 
                    INNER JOIN empleado.departamento ON empleados.depto = departamento.Id_depto
                    INNER JOIN empleado.puesto ON empleados.puesto = puesto.Id_puesto
                    INNER JOIN empleado.empleado_genro ON  empleados.genero = empleado_genro.Id_genero
                    INNER JOIN empleado.direc_indirc ON  empleados.dic_indc = direc_indirc.Id_direc
                    WHERE empleados.apellido  LIKE '%${valor}%'`;
                    environment_1.connection.query(queryString, (err, rows, fields) => {
                        if (rows.length > 0) {
                            resolve({ registros: rows });
                        }
                    });
                }
            }
        });
    });
}
exports.likeEmpleados = likeEmpleados;
