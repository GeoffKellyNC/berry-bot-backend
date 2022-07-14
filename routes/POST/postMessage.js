const express = require('express');
const router = express.Router();
const axios = require('axios');

const { chatBerry } = require('../../twitch/commandBerry');


const execute = async (message) => {
    chatBerry(message)
}



router.post('/', async (req, res) => {
    const { data } = req.body
    console.log('postMessage request: ', req)
    console.log('B/E postMessage Var: Message: ', message) //! DEBUGGING
    execute(data)
    res.send('Message Sent');
})


module.exports = router;