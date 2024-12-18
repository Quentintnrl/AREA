require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./Router/Router.js');
const pool = require('./db').connection;
// const pool = require('./db').close;
const { ServiceManager } = require('./Services/ServiceManager');

let serviceManager = new ServiceManager();
serviceManager.init();

async function serviceManagerLoop() {
    while (true) {
        console.log('SERVICE MANAGER LOOP');
        const [action_reactions] = await pool.query('SELECT * FROM action_reaction');
        await new Promise(resolve => setTimeout(resolve, 5000));
        for (let i = 0; i < action_reactions.length; i++) {
            console.log(action_reactions[i]);
            const user_id = action_reactions[i].user_id;
            console.log(user_id);
            const action = action_reactions[i].action;
            console.log(action);
            const actionId = action.id;
            console.log(actionId);
            const actionParam = action.params;
            console.log('action params', actionParam);
            try {
                if (await serviceManager.checkAction(user_id, actionParam)) {
                    console.log('Action is valid');
                    console.log('SERVICE MANAGER LOOP IF ACTION IS VALID');
                    const reaction = action_reactions[i].reaction;
                    console.log(reaction);
                    const reactionParam = reaction.params;
                    await serviceManager.executeReaction(user_id, reactionParam);
                }
                // throw new Error('Could not fetch actions data.');
            } catch (error) {
                console.error('Error fetching data from actions table:', error);
                throw new Error('Could not fetch actions data.');
            }
            continue;
            const reaction = action_reactions[i].reaction;
            console.log(reaction);
        }
    }
}

// const YAML = require('yamljs')
// const swaggerDoc = YAML.load('./Router/swagger.yml')
// const swaggerUI = require('swagger-ui-express')

const app = express();
const port = 8080;

app.use(cors());
app.use('/', router());
// app.use(
    //     "/api-docs",
    //     // swaggerUI.serve,S
    //     // swaggerUI.setup(swaggerDoc)
    // )
    
app.listen(port, () => {
    console.log('Server app listening on port ' + port);
    serviceManagerLoop();
});
