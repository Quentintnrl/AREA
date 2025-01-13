const { AbstractService } = require('./AbstractService');
const { Spotify } = require('./Spotify');
const { Github } = require('./Github');
const { TimeAndDate } = require('./TimeAndDate');

class ServicesFactory {
    constructor() {
    }

    createService(name, id) {
        if (typeof name !== 'string' || typeof id !== 'number') {
            throw new Error("Invalid service data");
        }
        switch (name) {
            case 'Spotify':
                console.log('Creating \"Spotify\" service');
                return new Spotify(id, name);
            case 'Github':
                console.log('Creating \"Github\" service');
                return new Github(id, name);
            case 'Time and Date':
                console.log('Creating \"Time and Date\" service');
                return new TimeAndDate(id, name);
            default:
                throw new Error("Unknown service type");
        }
    }
}

module.exports = { ServicesFactory };