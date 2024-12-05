const { AbstractService, Task } = require('../Services/AbstractService');

describe('AbstractService', () => {

    it('should crash when i try to create an instance of AbstractService', () => {
        expect(() => new AbstractService()).toThrowError();
    });

    it('should create a task', () => {
        const task = new Task(1, 'Task 1', ["param1", "param2"]);
        expect(task).toBeInstanceOf(Task);
        expect(task.id).toBe(1);
        expect(task.name).toBe('Task 1');
        expect(task.params).toEqual(["param1", "param2"]);
    });
});