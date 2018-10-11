"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const TypeProfiler = require("./TypeProfiler");
const typeProfiler = new TypeProfiler();
chai_1.use(sinonChai);
describe("TypeProfiler", () => {
    let collectTypeProfileSpy;
    beforeEach(() => {
        collectTypeProfileSpy = sinon.spy(typeProfiler, 'collectTypeProfile');
    });
    const typeProfiler = new TypeProfiler(), req = {
        params: {
            script: ""
        }
    }, res = {
        send: () => { }
    };
    describe("when started", () => {
        it("should make sure a JS script is included in its request", (done) => {
            req.params.script = "(function() {function foo(x) {if (x < 2) {return 42;}return `What are the return types of foo?`;}class Rectangle {};foo({});foo(1);foo(1.5);foo(`somestring`);foo(new Rectangle());})()";
            return typeProfiler.start(req, res).then(() => {
                chai_1.expect(collectTypeProfileSpy).to.have.callCount(0);
                done();
            });
        });
    });
});
//# sourceMappingURL=TypeProfiler.spec.js.map