"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const InspectorSession_1 = require("../InspectorSession/InspectorSession");
const http = require('http');
const query = require('querystring');
const fs = require('fs');
const inspectorSession = new InspectorSession_1.InspectorSession();
class TypeProfiler {
    constructor() {
    }
    start(script) {
        if (!script) {
            return this.readFile("dist/src/ex.js").then((script) => {
                return this.collectTypeProfile(script).then((profile) => {
                    const profileInfo = this.markUpCode(profile, script);
                    return profileInfo;
                });
            });
        }
        return this.collectTypeProfile(script).then((profile) => {
            const profileInfo = this.markUpCode(profile, script);
            return profileInfo;
        });
    }
    readFile(fileName) {
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, "utf8", (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    collectTypeProfile(source) {
        return __awaiter(this, void 0, void 0, function* () {
            let typeProfile;
            try {
                inspectorSession.connect();
                yield inspectorSession.postAsync('Runtime.enable');
                yield inspectorSession.postAsync('Profiler.enable');
                yield inspectorSession.postAsync('Profiler.startTypeProfile');
                let { scriptId } = yield inspectorSession.postAsync('Runtime.compileScript', {
                    expression: source,
                    sourceURL: "test",
                    persistScript: true
                });
                yield inspectorSession.postAsync('Runtime.runScript', { scriptId });
                let { result } = yield inspectorSession.postAsync('Profiler.takeTypeProfile');
                typeProfile = result.filter((typeResults) => {
                    return typeResults.scriptId == scriptId;
                });
            }
            finally {
                inspectorSession.disconnect();
            }
            return typeProfile[0].entries;
        });
    }
    markUpCode(entries, source) {
        entries = entries.sort((a, b) => b.offset - a.offset);
        for (let entry of entries) {
            source = source.slice(0, entry.offset) + entry.types +
                source.slice(entry.offset);
        }
        return source;
    }
    getPostBody(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                let body = "";
                request.on('data', data => body += data);
                request.on('end', end => resolve(query.parse(body)));
            });
        });
    }
    server(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("here §§§§§");
            let script = "", result = "", message_log = "", detailed = false, count = false;
            if (request.method == 'POST') {
                console.log("here !");
                try {
                    let post = yield this.getPostBody(request);
                    script = post.script;
                    let typeProfile = yield collectTypeProfile(script);
                    result = markUpCode(typeProfile, script);
                }
                catch (error) {
                    return error;
                }
            }
            else {
                console.log("hdkjhkdjhkdjkjd");
                this.readFile("dist/src/ex.js").then((script) => {
                    this.readFile("index.html").then((template) => {
                        let html = [
                            ["SCRIPT", script],
                            ["RESULT", result]
                        ].reduce((template, [pattern, replacement]) => {
                            return template.replace(pattern, replacement);
                        }, template);
                        response.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        response.end(html);
                    });
                });
            }
        });
    }
}
exports.TypeProfiler = TypeProfiler;
//# sourceMappingURL=TypeProfiler.js.map