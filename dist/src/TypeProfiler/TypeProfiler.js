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
const abstract_syntax_tree_1 = require("abstract-syntax-tree");
const toAST = require('to-ast');
const escodegen = require('escodegen');
const http = require('http');
const query = require('querystring');
const fs = require('fs');
const inspectorSession = new InspectorSession_1.InspectorSession();
class TypeProfiler {
    constructor() {
    }
    start(req, res) {
        const script = req.params.script;
        console.log("here");
        if (script) {
            console.log(">>>", this.isJavaScriptValid(script));
            return this.collectTypeProfile(script).then((profile) => {
                const profileInfo = this.markUpCode(profile, script);
                res.send(profileInfo);
            });
        }
    }
    isJavaScriptValid(script) {
        const ast = new abstract_syntax_tree_1.AbstractSyntaxTree(script);
        return ast;
    }
    collectTypeProfile(source) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("2");
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
            catch (error) {
                return error;
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
}
module.exports = TypeProfiler;
//# sourceMappingURL=TypeProfiler.js.map