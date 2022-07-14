const express = require('express');
const router = express.Router();
const path = require('path')
const { promises: fs } = require('fs')



router.post("/", async (req, res) => {
    const {clientId, clientSecret, accessToken, refreshToken } = req.body.botConfig;
    const configLocation = path.join(__dirname, '../../twitch/bot-config.json')
    const configData = JSON.parse(await fs.readFile(configLocation, 'utf-8'))
    configData.clientId = clientId
    configData.clientSecret = clientSecret
    configData.accessToken = accessToken
    configData.refreshToken = refreshToken
    await fs.writeFile(configLocation, JSON.stringify(configData, null, 4, 'UTF-8'))
    console.log('Config written to file')
    //Restart Server
    process.exit()

    res.send(res.status)
})

module.exports = router;