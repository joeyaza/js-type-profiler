import {InspectorSession} from '../InspectorSession/InspectorSession';
const http = require('http');
const query = require('querystring');
const fs = require('fs');
const inspectorSession = new InspectorSession();


export class TypeProfiler {

    constructor() {

    }

    public start(script?: string): Promise<any>  {

        if (!script) {

            return this.readFile("dist/src/ex.js").then((script)=> {

                return this.collectTypeProfile(script).then((profile) => {

                    const profileInfo = this.markUpCode(profile, script);

                    // console.log(profileInfo);

                    return profileInfo;

                });

            });

        }

        return this.collectTypeProfile(script).then((profile) => {

            const profileInfo = this.markUpCode(profile, script);

            // console.log(profileInfo);

            return profileInfo;

        });


    }

    private readFile(fileName): Promise<any> {

      return new Promise(

        (resolve, reject) => {

          fs.readFile(fileName, "utf8", (error, result) => {

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


    private async getPostBody(request) {

        return new Promise(function(resolve) {

           let body = "";
           request.on('data', data => body += data);
           request.on('end', end => resolve(query.parse(body)));

      });

    }


    private async server(request, response) {

        console.log("here §§§§§")

          let script = "",
              result = "",
              message_log = "",
              detailed = false,
              count = false;

          if (request.method == 'POST') {

              console.log("here !")

            // Collect type profile on the script from input form.
            try {

              let post = await this.getPostBody(request);

              script = post.script;

              let typeProfile = await collectTypeProfile(script);

              result = markUpCode(typeProfile, script);

            } catch (error) {
              
              return error;

            }

          } else {

              console.log("hdkjhkdjhkdjkjd")
            // Use example file.

            this.readFile("dist/src/ex.js").then((script) => {

                this.readFile("index.html").then((template) => {

                    let html = [
                        ["SCRIPT", script],
                        ["RESULT", result]
                      ].reduce((template, [pattern, replacement]) => {

                        return template.replace(pattern, replacement);

                    }, template);

                      response.writeHead(200, {

                        'Content-Type': 'text/html'

                      });

                      response.end(html);

                });

            });

          }

 
        
    }

}


// module.exports = TypeProfiler;
