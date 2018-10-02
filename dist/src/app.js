'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const TypeProfiler_1 = require("./TypeProfiler/TypeProfiler");
const http = require("http");
const typeProfiler = new TypeProfiler_1.TypeProfiler();
http.createServer(typeProfiler.server).listen(8080);
console.log("Listening on localhost:8080");
//# sourceMappingURL=app.js.map