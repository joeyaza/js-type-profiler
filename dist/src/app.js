"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeProfiler_1 = require("./TypeProfiler/TypeProfiler");
const restify = require("restify");
const typeProfiler = new TypeProfiler_1.default(), server = restify.createServer();
server.use(restify.plugins.bodyParser({
    mapParams: true
}));
server.post('/', typeProfiler.start.bind(typeProfiler));
server.listen(8080, () => {
    console.log('%s listening at %s', server.name, server.url);
});
//# sourceMappingURL=app.js.map