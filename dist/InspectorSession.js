"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inspector = require('inspector');
class InspectorSession extends inspector.Session {
    constructor() {
        super();
    }
    postAsync(...args) {
        let session = this;
        return new Promise((resolve, reject) => {
            session.post(...args, (error, result) => {
                if (error !== null) {
                    reject(error);
                }
                else if (result.exceptionDetails !== undefined) {
                    reject(result.exceptionDetails.exception.description);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.InspectorSession = InspectorSession;
//# sourceMappingURL=InspectorSession.js.map