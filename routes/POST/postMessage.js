const express = require('express');
const router = express.Router();
const axios = require('axios');

const { chatBerry } = require('../../twitch/commandBerry');


const execute = async (message) => {
    chatBerry(message)
}



router.post('/', async (req, res) => {
    const { message } = req.body;
    console.log('B/E postMessage Var: Message: ', message) //! DEBUGGING
    execute(message)
    res.send('Message Sent');
})


module.exports = router;