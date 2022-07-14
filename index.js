require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');

const routerGetTarget = require('./routes/GET/getTarget');
const routerPostTarget = require('./routes/POST/postTarget');
const routerStartBot = require('./routes/POST/startBot');
const routerPostBotConfig = require('./routes/POST/postBotConfig');
const routerGetBotConfig = require('./routes/GET/getBotConfig');
const routerStartVote = require('./routes/POST/startVote')
const routerStartMod = require('./routes/POST/startMod')
const routerPing = require('./routes/POST/ping')
const routerPostMessage = require('./routes/POST/postMessage')




//? ---- Server Port ----//
const PORT = process.env.PORT || 9001;

const app = express();

app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
 

// GET 
app.use('/getTarget', routerGetTarget); // route to get target 
app.use('/botConfig', routerGetBotConfig); // route to retrieve bot config data


// POST 
app.use('/postTarget', routerPostTarget); // set target in bot config
app.use('/startBot', routerStartBot); // route to the start bot function
app.use('/postBotConfig', routerPostBotConfig); // route used to set bot config
app.use('/startVote', routerStartVote) // route used to start voting
app.use('/startMod', routerStartMod) // route used to start berry moderation 
app.use('/pingBerry', routerPing) // route used to ping the server
app.use('/postMessage', routerPostMessage) // route used to post messages to the chat


app.listen(PORT, () => {
  console.log(`Berry's Backend is running on ${PORT}......`);
});

