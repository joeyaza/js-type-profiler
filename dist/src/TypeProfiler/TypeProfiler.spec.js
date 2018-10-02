"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinonChai = require("sinon-chai");
const TypeProfiler_1 = require("./TypeProfiler");
chai_1.use(sinonChai);
describe("TypeProfiler", () => {
    const typeProfiler = new TypeProfiler_1.TypeProfiler();
    describe("when asked to get type profiling", () => {
        it("should return typing info", () => {
            const script = `((num) => {
							return num;
							})(2);`;
            typeProfiler.start(script).then((result) => {
                console.log(typeof result);
            });
        });
    });
});
//# sourceMappingURL=TypeProfiler.spec.js.map