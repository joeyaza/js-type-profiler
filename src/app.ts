'use strict';
const TypeProfiler = require("./TypeProfiler/TypeProfiler");
const typeProfiler = new TypeProfiler();
import * as restify from "restify";

const server = restify.createServer();
server.use(restify.plugins.bodyParser({
    mapParams: true
}));

//@POST
server.post('/', typeProfiler.start.bind(typeProfiler));

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});