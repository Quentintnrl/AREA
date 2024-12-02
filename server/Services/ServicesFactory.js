const { AbstractService } = require('./AbstractService');

class ServicesFactory {
    constructor() {
    }

    createService(name, id) {
        if (typeof name !== 'string' || typeof id !== 'number') {
            throw new Error("Invalid service data");
        }
        switch (name) {
            default:
                throw new Error("Unknown service type");
        }
    }
}

module.exports = { ServicesFactory };