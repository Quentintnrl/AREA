const { AbstractService } = require('./AbstractService');
const { Spotify } = require('./Spotify');

class ServicesFactory {
    constructor() {
    }

    createService(name, id) {
        if (typeof name !== 'string' || typeof id !== 'number') {
            throw new Error("Invalid service data");
        }
        switch (name) {
            case 'Spotify':
                return new Spotify(id, name);
            default:
                throw new Error("Unknown service type");
        }
    }
}

module.exports = { ServicesFactory };