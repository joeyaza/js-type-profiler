import TypeProfiler from "./TypeProfiler/TypeProfiler";
import * as restify from "restify";

const typeProfiler = new TypeProfiler(),
    server = restify.createServer();
    
server.use(restify.plugins.bodyParser({
    mapParams: true
}));

//@POST
server.post('/', typeProfiler.start.bind(typeProfiler));

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});