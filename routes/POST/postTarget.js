const express = require('express');
const router = express.Router();
const path = require('path')
const { promises: fs } = require('fs')


const writeTarget = async (target) => {
    // write target to ../twitch/bot-config.json
    const targetLocation = path.join(__dirname, '../../twitch/bot-config.json')
    const targetData = JSON.parse(await fs.readFile(targetLocation, 'utf-8'))
    targetData.target = target
    await fs.writeFile(targetLocation, JSON.stringify(targetData, null, 4, 'UTF-8'))
}

router.post("/", (req, res) => {   
    const { target } = req.body;
    writeTarget(target);
    res.send(target);
  })

  module.exports = router;