"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const TypeProfiler = require("./TypeProfiler");
chai_1.use(sinonChai);
let collectTypeProfileSpy, typeProfiler, req, res;
describe("TypeProfiler", () => {
    beforeEach(() => {
        typeProfiler = new TypeProfiler(),
            collectTypeProfileSpy = sinon.spy(typeProfiler, 'collectTypeProfile'),
            req = {
                params: {
                    script: ""
                }
            },
            res = {
                send: () => { }
            };
    });
    describe("when started", () => {
        describe("when accurate js script is included in request", () => {
            it("should collect type profile summary", () => {
                req.params.script = "(function() {function foo(x) {if (x < 2) {return 42;}return `What are the return types of foo?`;}class Rectangle {};foo({});foo(1);foo(1.5);foo(`somestring`);foo(new Rectangle());})()";
                return typeProfiler.start(req, res).then(() => {
                    chai_1.expect(collectTypeProfileSpy).to.have.callCount(1);
                });
            });
        });
        describe("when incorrent js script is included in request", () => {
            it("should throw error and not collect types", () => {
                req.params.script = "(dhjskda fucntion Class(){`{{";
                return typeProfiler.start(req, res).catch((error) => {
                    chai_1.expect(collectTypeProfileSpy).to.have.callCount(0);
                });
            });
        });
    });
});
//# sourceMappingURL=TypeProfiler.spec.js.map