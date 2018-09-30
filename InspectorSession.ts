const inspector = require('inspector');

export class InspectorSession extends inspector.Session {

  constructor() {

    super();

  }

  postAsync(...args): Promise<any> {

    let session = this;

    return new Promise(function(resolve, reject) {

      session.post(...args, function(error, result) {

        if (error !== null) {

          reject(error);

        } else if (result.exceptionDetails !== undefined) {

          reject(result.exceptionDetails.exception.description);

        } else {

          resolve(result);

        }

      });

    });

  }


}