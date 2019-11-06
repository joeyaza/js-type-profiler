import * as inspector from "inspector";

class InspectorSession extends inspector.Session {

  constructor() {

    super();

  }

  public postAsync(...args): Promise<any> {

    let session: any = this;

    return new Promise((resolve, reject) => {

      session.post(...args, (error: Error, result: any) => {

        if (error || result.exceptionDetails) {

          return reject(error || result.exceptionDetails.exception.description);

        }

        return resolve(result);

      });

    });

  }


}

export default InspectorSession;