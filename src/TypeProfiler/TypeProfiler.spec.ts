import {expect, use} from "chai";
import * as sinonChai from "sinon-chai";
import * as util from "util";

import {TypeProfiler} from './TypeProfiler';

use(sinonChai);

describe("TypeProfiler", () => {

	const typeProfiler = new TypeProfiler();

	describe("when asked to get type profiling", () => {

		it("should return typing info", () => {

			const script = `((num) => {
							return num;
							})(2);`;



			typeProfiler.start(script).then((result) => {

				console.log(typeof result);

				// console.log(util.inspect(result, false, null, true));

			});

		});

	});

});