import {InspectorSession} from './InspectorSession';
const http = require('http');
const query = require('querystring');
const fs = require('fs');
const inspectorSession = new InspectorSession();


class TypeProfiler {

    constructor() {

    }

    start(): Promise<string>  {

        return this.readFile("./ex.js").then((script)=> {

            return this.collectTypeProfile(script).then((profile) => {

                const profileInfo = JSON.stringify(this.markUpCode(profile, script));

                console.log(profileInfo);

                return profileInfo;

            });

        });

    }

    readFile(file_name) {

      return new Promise(

        function(resolve, reject) {

          fs.readFile(file_name, "utf8", function(error, result) {

            if (error) {

              reject(error);

            } else {

              resolve(result);

            }

          });

        });

    }

    async collectTypeProfile(source) {

        let typeProfile = "";
        
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

            [{ entries: typeProfile }] = result.filter(x => x.scriptId == scriptId);  

        } finally {
    // Close inspectorSession and return.

            inspectorSession.disconnect();

        }

        return typeProfile;

    }

    markUpCode(entries, source) {

          entries = entries.sort((a, b) => b.offset - a.offset);

          for (let entry of entries) {

            source = source.slice(0, entry.offset) + entry.types +
              source.slice(entry.offset);

          }

          return source;

    }


    getPostBody(request) {

        return new Promise(function(resolve) {

            let body = "";

            request.on('data', data => body += data);

            request.on('end', end => resolve(query.parse(body)));

        });

    }

}


module.exports = TypeProfiler;
