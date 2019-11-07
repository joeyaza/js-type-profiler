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
const TypeProfiler_1 = require("./TypeProfiler");
let collectTypeProfileSpy, typeProfiler, req, res, resSendSpy;
describe("TypeProfiler", () => {
    beforeEach(() => {
        typeProfiler = new TypeProfiler_1.default(),
            collectTypeProfileSpy = jest.spyOn(typeProfiler, 'collectTypeProfile'),
            req = {
                body: {
                    script: ""
                }
            },
            res = {
                send: () => { }
            };
        resSendSpy = jest.spyOn(res, 'send');
    });
    describe("when started", () => {
        describe("when accurate js script is included in request", () => {
            it("should collect type profile summary", () => __awaiter(this, void 0, void 0, function* () {
                req.body.script = "(function() {function foo(x) {if (x < 2) {return 42;}return `What are the return types of foo?`;}class Rectangle {};foo({});foo(1);foo(1.5);foo(`somestring`);foo(new Rectangle());})()";
                yield typeProfiler.start(req, res);
                expect(collectTypeProfileSpy).toHaveBeenCalledTimes(1);
                expect(typeof resSendSpy.mock.calls[0][0]).toBe("string");
            }));
        });
        describe("when incorrect js script is included in request", () => {
            it("should throw error and not collect types", () => __awaiter(this, void 0, void 0, function* () {
                req.body.script = "(dhjskda fucntion Class(){`{{";
                try {
                    yield typeProfiler.start(req, res);
                }
                catch (error) {
                    expect(collectTypeProfileSpy).toBeCalledTimes(0);
                    expect(error).toBeInstanceOf(Error);
                }
            }));
        });
    });
});
//# sourceMappingURL=TypeProfiler.spec.js.map