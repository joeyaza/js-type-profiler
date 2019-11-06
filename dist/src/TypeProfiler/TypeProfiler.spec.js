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
const chai_1 = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const TypeProfiler_1 = require("./TypeProfiler");
chai_1.use(sinonChai);
let collectTypeProfileSpy, typeProfiler, req, res;
describe("TypeProfiler", () => {
    beforeEach(() => {
        typeProfiler = new TypeProfiler_1.default(),
            collectTypeProfileSpy = sinon.spy(typeProfiler, 'collectTypeProfile'),
            req = {
                body: {
                    script: ""
                }
            },
            res = {
                send: () => { }
            };
    });
    describe("when started", () => {
        describe("when accurate js script is included in request", () => {
            it("should collect type profile summary", () => __awaiter(this, void 0, void 0, function* () {
                req.body.script = "(function() {function foo(x) {if (x < 2) {return 42;}return `What are the return types of foo?`;}class Rectangle {};foo({});foo(1);foo(1.5);foo(`somestring`);foo(new Rectangle());})()";
                yield typeProfiler.start(req, res);
                chai_1.expect(collectTypeProfileSpy).to.have.callCount(1);
            }));
        });
        describe("when incorrect js script is included in request", () => {
            it("should throw error and not collect types", () => __awaiter(this, void 0, void 0, function* () {
                req.body.script = "(dhjskda fucntion Class(){`{{";
                try {
                    yield typeProfiler.start(req, res);
                }
                catch (error) {
                    chai_1.expect(collectTypeProfileSpy).to.have.callCount(0);
                    chai_1.expect(error).to.be.instanceof(Error);
                }
            }));
        });
    });
});
//# sourceMappingURL=TypeProfiler.spec.js.map