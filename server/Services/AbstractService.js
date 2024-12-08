class Task {
    constructor(id, name, params) {
        if (typeof id !== 'number') {
            throw new Error("ID must be a number");
        }
        if (typeof name !== 'string') {
            throw new Error("Name must be a string");
        }
        if (typeof params !== 'object') {
            throw new Error("Params must be an object");
        }
        this._id = id;
        this._name = name;
        this._params = params;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get params() {
        return this._params;
    }
}

class AbstractService {
    constructor(id, name) {
        if (typeof id !== 'number') {
            throw new Error("ID must be a number");
        }
        if (typeof name !== 'string') {
            throw new Error("Name must be a string");
        }
        if (this.target === AbstractService) {
            throw new Error("Cannot instantiate abstract class");
        }
        this._id = id;
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = id;
    }

    display() {
        console.log(`Service: ${this._name}, ID: ${this._id}`);
    }

    // Abstract method
    add_task(task) {
        throw new Error("Method 'add_task()' must be implemented.");
        if (typeof task !== Task) {
            throw new Error("Task must be an instance of Task");
        }
    }
}

module.exports = { AbstractService, Task };