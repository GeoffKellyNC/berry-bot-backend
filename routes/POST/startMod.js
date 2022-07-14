const express = require('express');
const router = express.Router()
const { modBerry } = require('../../twitch/modBerry');


const startModeration = () => {
    modBerry()
}




router.post('/', (req, res) => {
    const { data } = req.body


    if(data === 'startMod'){
        startModeration()
    }
    res.sendStatus(200)
})

module.exports = router;