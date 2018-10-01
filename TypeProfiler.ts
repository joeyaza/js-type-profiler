import {InspectorSession} from './InspectorSession';
const http = require('http');
const query = require('querystring');
const fs = require('fs');
const inspectorSession = new InspectorSession();


class TypeProfiler {

    constructor() {

    }

    public start(): Promise<any>  {

        return this.readFile("dist/ex.js").then((script)=> {

            return this.collectTypeProfile(script).then((profile) => {

                const profileInfo = this.markUpCode(profile, script);

                console.log(profileInfo);

                return profileInfo;

            });

        });

    }

    private readFile(file_name): Promise<any> {

      return new Promise(

        (resolve, reject) => {

          fs.readFile(file_name, "utf8", (error, result) => {

            if (error) {

              reject(error);

            } else {

              resolve(result);

            }

          });

        });

    }

    private async collectTypeProfile(source: string) : Promise<any> {

        let typeProfile;
        
        try {

            inspectorSession.connect();

    // Enable relevant inspector domains.
            await inspectorSession.postAsync('Runtime.enable');
            await inspectorSession.postAsync('Profiler.enable');
            await inspectorSession.postAsync('Profiler.startTypeProfile');

    // Compile script.
            let { scriptId } = await inspectorSession.postAsync('Runtime.compileScript', {
                expression: source,
                sourceURL: "test",
                persistScript: true
            });

    // Execute script.
            await inspectorSession.postAsync('Runtime.runScript', { scriptId });

            let { result } = await inspectorSession.postAsync('Profiler.takeTypeProfile');

            typeProfile = result.filter((typeResults) => {

                return typeResults.scriptId == scriptId;

            });  

        } finally {

    // Close inspectorSession and return.
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
