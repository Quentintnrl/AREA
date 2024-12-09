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

module.exports = {
    getAllServices,
    getAllActions,
    getAllReactions
};
