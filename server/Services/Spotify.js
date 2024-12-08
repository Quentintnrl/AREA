const { AbstractService, Task } = require('./AbstractService');

class Spotify extends AbstractService {
    constructor(id, name) {
        super(id, name);
        console.log('Spotify service created');
    }
}

module.exports = { Spotify };