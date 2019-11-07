import TypeProfiler from "./TypeProfiler";

let collectTypeProfileSpy,
	typeProfiler,
	req,
	res,
	resSendSpy;


describe("TypeProfiler", () => {

	beforeEach(() => {

		typeProfiler = new TypeProfiler(),
		collectTypeProfileSpy = jest.spyOn(typeProfiler, 'collectTypeProfile'),
		req = {
			body: {
				script: ""
			}
		},
		res = {
			send: () => {}
		};
		resSendSpy = jest.spyOn(res, 'send');
	});


	describe("when started", () => {

		describe("when accurate js script is included in request", () => {

			it("should collect type profile summary", async () => {

				req.body.script = "(function() {function foo(x) {if (x < 2) {return 42;}return `What are the return types of foo?`;}class Rectangle {};foo({});foo(1);foo(1.5);foo(`somestring`);foo(new Rectangle());})()";

				await typeProfiler.start(req, res);

				expect(collectTypeProfileSpy).toHaveBeenCalledTimes(1);
				expect(typeof resSendSpy.mock.calls[0][0]).toBe("string");
		
			});

		});

		describe("when incorrect js script is included in request", () => {

			it("should throw error and not collect types", async () => {

				req.body.script = "(dhjskda fucntion Class(){`{{";

				try {

					await typeProfiler.start(req, res);

				} catch(error) {

					expect(collectTypeProfileSpy).toBeCalledTimes(0);
					expect(error).toBeInstanceOf(Error);

				}

			});

		});

	});

});