import {expect, use} from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import * as util from "util";

import TypeProfiler from "./TypeProfiler";

use(sinonChai);

let collectTypeProfileSpy,
	typeProfiler,
	req,
	res;


describe("TypeProfiler", () => {

	beforeEach(() => {

		typeProfiler = new TypeProfiler(),
		collectTypeProfileSpy = sinon.spy(typeProfiler, 'collectTypeProfile'),
		req = {
			body: {
				script: ""
			}
		},
		res = {
			send: () => {}
		};

	});


	describe("when started", () => {

		describe("when accurate js script is included in request", () => {

			it("should collect type profile summary", async () => {

				req.body.script = "(function() {function foo(x) {if (x < 2) {return 42;}return `What are the return types of foo?`;}class Rectangle {};foo({});foo(1);foo(1.5);foo(`somestring`);foo(new Rectangle());})()";

				await typeProfiler.start(req, res);

				expect(collectTypeProfileSpy).to.have.callCount(1);
		
			});

		});

		describe("when incorrect js script is included in request", () => {

			it("should throw error and not collect types", async () => {

				req.body.script = "(dhjskda fucntion Class(){`{{";

				try {

					await typeProfiler.start(req, res);

				} catch(error) {

					expect(collectTypeProfileSpy).to.have.callCount(0);
					expect(error).to.be.instanceof(Error);

				}

			});

		});

	});

});