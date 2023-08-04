"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./routes/router"));
const empleado_1 = __importDefault(require("./routes/empleado"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const planilla_1 = __importDefault(require("./routes/planilla"));
const adjuntos_1 = __importDefault(require("./routes/adjuntos"));
const basicos_1 = __importDefault(require("./routes/basicos"));
const server = server_1.default.instance;
// BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
// Rutas de servicios
server.app.use('/', router_1.default);
server.app.use('/empleados', empleado_1.default);
server.app.use('/usuarios', usuario_1.default);
server.app.use('/planillas', planilla_1.default);
server.app.use('/adjuntos', adjuntos_1.default);
server.app.use('/basicos', basicos_1.default);
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
