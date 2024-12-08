const { ActionChecker } = require('../Services/ActionChecker');
const { ServiceManager } = require('../Services/ServiceManager');
const pool = require('../db').connection;
const disconnect = require('../db').close;

const printActionReactionTable = async () => {
    try {
        // Use await to ensure the query resolves before moving to the next part
        const [rows] = await pool.query('SELECT * FROM action_reaction');
        // Print the result rows
        console.log('action_reaction Table Contents:');
        rows.forEach(row => {
            console.log(`user_id: ${row.user_id}, action: ${JSON.stringify(row.action)}, reaction: ${JSON.stringify(row.reaction)}`);
        });
    } catch (error) {
        // Log full error details if message is unavailable
        console.error('Error fetching data from action_reaction table:', error);
    }
};

describe('ActionChecker', () => {

    let tmp;

    // beforeAll(async () => {
    //     tmp = new ServiceManager();
    //     await tmp.init(); // Ensure init is completed before the tests
    // });

    it('should create an action checker', async () => {
        new ActionChecker(tmp);
    });

    // it('should start and stop an action checker', async () => {
    //     let actionChecker = new ActionChecker(tmp);
    //     // await printActionReactionTable();
    //     //sleep 5 seconds
    //     await actionChecker.start();
    //     await actionChecker.stop();
    // });

    // afterAll(() => {
    //     disconnect();
    // });
});
