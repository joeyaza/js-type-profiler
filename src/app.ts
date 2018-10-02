'use strict';
import {TypeProfiler} from './TypeProfiler/TypeProfiler';
import * as http from "http";
const typeProfiler = new TypeProfiler();

// typeProfiler.start();

http.createServer(typeProfiler.server).listen(8080);
console.log("Listening on localhost:8080");