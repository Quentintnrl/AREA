const { get } = require('http');

const pool = require('./db').connection;

async function getAllServices()
{

    try {
        const [existingServices] = await pool.execute('SELECT * FROM services');
        return existingServices;
    } catch (error) {
        console.error('Error getting reactions:', error);
        throw error;
    }
}

async function getAllActions()
{
    try {
        const [existingActions] = await pool.execute('SELECT * FROM actions');
        return existingActions;
    } catch (error) {
        console.error('Error getting reactions:', error);
        throw error;
    }
}

async function getAllReactions()
{
    try {
        const [existingReactions] = await pool.execute('SELECT * FROM reactions');
        return existingReactions;
    } catch (error) {
        console.error('Error getting reactions:', error);
        throw error;
    }
}

async function getaboutroutes(ip)
{
    try {
        var about = {"client":{"host": ip}, "server":{"current_time":"", "service":[]}};
        console.log("the adress is: " + ip);
        const [services] = await pool.execute('SELECT * FROM services');
        for (i = 0; i < services.length; i++) {
            var aboutService = {"name": services[i].name, "actions":[], "reactions":[]}
            var [actions] = await pool.execute('SELECT * FROM actions WHERE service_id = ?', [services[i].id]);
            for (j = 0; j < actions.length; j++) {
                var aboutAction = {"name":actions[j].name, "description":actions[j].description}
                aboutService.actions.push(aboutAction);
            }
            var [reactions] = await pool.execute('SELECT * FROM reactions WHERE service_id = ?', [services[i].id]);
            for (j = 0; j < reactions.length; j++) {
                var aboutReaction = {"name":reactions[j].name, "description":reactions[j].description}
                aboutService.reactions.push(aboutReaction);
            }
            about.server.service.push(aboutService);
        }
        return about;
    } catch (error) {
        console.error('Error getting about routes:', error);
        throw error;
    }
}

async function getServiceReactions(serviceId)
{
    try {
        const [existingReactions] = await pool.execute('SELECT * FROM reactions WHERE service_id = ?', [serviceId]);
        return existingReactions;
    } catch (error) {
        console.error('Error getting reactions:', error);
        throw error;
    }
}

async function getServiceActions(serviceId)
{
    try {
        const [existingActions] = await pool.execute('SELECT * FROM actions WHERE service_id = ?', [serviceId]);
        return existingActions;
    } catch (error) {
        console.error('Error getting reactions:', error);
        throw error;
    }
}

module.exports = {
    getAllServices,
    getAllActions,
    getAllReactions,
    getServiceActions,
    getServiceReactions,
    getaboutroutes
};
