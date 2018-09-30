var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const InspectorSession = require('./InspectorSession');
const http = require('http');
const query = require('querystring');
const fs = require('fs');
const inspectorSession = new InspectorSession();
class TypeProfiler {
    constructor() {
    }
    start() {
        return this.readFile("./ex.js").then((script) => {
            return this.collectTypeProfile(script).then((profile) => {
                const profileInfo = JSON.stringify(this.markUpCode(profile, script));
                console.log(profileInfo);
                return profileInfo;
            });
        });
    }
    readFile(file_name) {
        return new Promise(function (resolve, reject) {
            fs.readFile(file_name, "utf8", function (error, result) {
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
            let typeProfile = "";
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
                [{ entries: typeProfile }] = result.filter(x => x.scriptId == scriptId);
            }
            finally {
                inspectorSession.disconnect();
            }
            return typeProfile;
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
        return new Promise(function (resolve) {
            let body = "";
            request.on('data', data => body += data);
            request.on('end', end => resolve(query.parse(body)));
        });
    }
}
module.exports = TypeProfiler;
//# sourceMappingURL=TypeProfiler.js.map