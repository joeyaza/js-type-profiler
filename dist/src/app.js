'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const TypeProfiler = require("./TypeProfiler/TypeProfiler");
const typeProfiler = new TypeProfiler();
const restify = require("restify");
const server = restify.createServer();
server.use(restify.plugins.bodyParser({
    mapParams: true
}));
server.post('/', typeProfiler.start.bind(typeProfiler));
server.listen(8080, () => {
    console.log('%s listening at %s', server.name, server.url);
});
//# sourceMappingURL=app.js.map