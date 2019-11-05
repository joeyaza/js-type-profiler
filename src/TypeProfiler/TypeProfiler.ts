import {InspectorSession} from '../InspectorSession/InspectorSession';
import { get } from 'restify-decorators'
import * as restify from 'restify'
import * as util from "util";
import { throws } from 'assert';
const escodegen = require('escodegen');
const http = require('http');
const query = require('querystring');
const fs = require('fs');
const AbstractSyntaxTree = require('abstract-syntax-tree');

class TypeProfiler {

	constructor() {

	}

	public async start(req: any, res: any): Promise<any> {

	  const script = req.body;

	  if (script) {

		try {

			await this.isJavaScriptValid(script);

			const profile = await this.collectTypeProfile(script);

			profile.forEach(profileItem => {
				
				console.log(util.inspect(profileItem, {depth: 2}));

			});

			const profileInfo = this.markUpCode(profile, script);

	  		res.send(profileInfo);
			 
		} catch(error) {

			res.send(error);
			throw error;

		}

	  }
	

	}

	private isJavaScriptValid(script: string): any {

		return new Promise((resolve, reject) => {

			const ast = new AbstractSyntaxTree(script);

			if (!ast) return reject(Error);

            return resolve(ast);

		});

	}

	private async collectTypeProfile(source: string) : Promise<[]> {

		const inspectorSession = new InspectorSession();
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
