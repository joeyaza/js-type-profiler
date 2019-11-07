import InspectorSession from '../InspectorSession/InspectorSession';
import * as util from "util";
import {parse} from "abstract-syntax-tree";

class TypeProfiler {

	constructor() {

	}

	public async start(req: {body: {script: string}}, res: {send}): Promise<any> {

	  const script = req.body.script;

	  if (script) {

		try {

			this.isJavaScriptValid(script);

			const profile = await this.collectTypeProfile(script);

			profile.forEach(profileItem => {
				
				//console.log(util.inspect(profileItem, {depth: 2}));

			});

			const profileInfo = this.markUpCode(profile, script);

	  		res.send(profileInfo);
			 
		} catch(error) {

			res.send(error);
			throw error;

		}

	  }
	

	}


	private isJavaScriptValid(script: string): Error | boolean {

		try {

			parse(script);

		} catch {

			throw new Error("Invalid JavaScript, please try again!");

		}

		return true;

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

	private markUpCode(entries: any, source: string): string {

		entries = entries.sort((a, b) => b.offset - a.offset);

		for (let entry of entries) {

			const typesStr = JSON.stringify(entry.types);

			source = source.slice(0, entry.offset) + typesStr +
				source.slice(entry.offset);

		}

		return source;

	}

}


export default TypeProfiler;
