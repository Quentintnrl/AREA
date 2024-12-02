const { AbstractService } = require('./AbstractService');

class ServicesFactory {
    constructor() {
    }

    createService(serviceName, serviceId) {
        if (typeof serviceName !== 'string' || typeof serviceId !== 'number') {
            throw new Error("Invalid service data");
        }
        throw new Error("Unknown service type");
    }
}

module.exports = { ServicesFactory };