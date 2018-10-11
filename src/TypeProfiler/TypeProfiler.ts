import {InspectorSession} from '../InspectorSession/InspectorSession';
import { get } from 'restify-decorators'
import * as restify from 'restify'
const http = require('http');
const query = require('querystring');
const fs = require('fs');
const inspectorSession = new InspectorSession();


class TypeProfiler {

	constructor() {

	}

	public start(req: any, res:any): Promise<any> {

	  const script = req.params.script;

	  console.log("here")

	  if (script) {

	  	return this.collectTypeProfile(script).then((profile) => {

	  		const profileInfo = this.markUpCode(profile, script);

	  		res.send(profileInfo);

	  	});

	  }

	}

	private async collectTypeProfile(source: string) : Promise<any> {

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
