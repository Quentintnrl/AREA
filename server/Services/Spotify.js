const { AbstractService, Task } = require('./AbstractService');

class Spotify extends AbstractService {
    constructor(id, name) {
        super(id, name);
        console.log('Spotify service created');
    }

    do_task(task) {
        if (task instanceof Task) {
            console.log(`Spotify service is doing task: ${task.name}`);
        } else {
            throw new Error('Task must be an instance of Task');
        }
    }
}

module.exports = { Spotify };