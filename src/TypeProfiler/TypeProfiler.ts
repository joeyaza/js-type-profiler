import {InspectorSession} from '../InspectorSession/InspectorSession';
import { get } from 'restify-decorators'
import * as restify from 'restify'
const escodegen = require('escodegen');
const http = require('http');
const query = require('querystring');
const fs = require('fs');
const inspectorSession = new InspectorSession();
const AbstractSyntaxTree = require('abstract-syntax-tree');

class TypeProfiler {

	constructor() {

	}

	public start(req: any, res: any): Promise<any> {

	  const script = req.params.script;

	  if (script) {

	  	const astResp = this.isJavaScriptValid(script);

	  	// if (!astResp) throw Error("Your JavaScript is inaccurate, please try again...");

	  	return this.collectTypeProfile(script).then((profile) => {

	  		const profileInfo = this.markUpCode(profile, script);

	  		res.send(profileInfo);

	  	}).catch((error) => {

	  		res.send(error);
	  		throw error;

	  	});

	  }

	}

	private isJavaScriptValid(script: string): any {

		let ast;

		try {

			ast = new AbstractSyntaxTree(script);

		} catch(error) {

			throw Error("Your JavaScript is inaccurate, please try again...");

		}

		return ast;

	}

	private async collectTypeProfile(source: string) : Promise<any> {

		console.log("2");

		let typeProfile;
		
		try {

		 inspectorSession.connect();

			await inspectorSession.postAsync('Runtime.enable');
			await inspectorSession.postAsync('Profiler.enable');
			await inspectorSession.postAsync('Profiler.startTypeProfile');

			let { scriptId } = await inspectorSession.postAsync('Runtime.compileScript', {
				expression: source,
				sourceURL: "test",
				persistScript: true
			});

			await inspectorSession.postAsync('Runtime.runScript', { scriptId });

			let { result } = await inspectorSession.postAsync('Profiler.takeTypeProfile');

			typeProfile = result.filter((typeResults) => {

				return typeResults.scriptId == scriptId;

			});  

		} catch(error) {

			return error;

		} finally {

		 inspectorSession.disconnect();

		}

		return typeProfile[0].entries;

	}

	private markUpCode(entries: any, source:string): string {

		entries = entries.sort((a, b) => b.offset - a.offset);

		for (let entry of entries) {

			source = source.slice(0, entry.offset) + entry.types +
				source.slice(entry.offset);

		}

		return source;

	}

}


module.exports = TypeProfiler;
