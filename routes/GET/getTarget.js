const express = require('express');
const router = express.Router();
const botConfig = require('../../twitch/bot-config');


router.get("/", (req, res) => {
    res.send(botConfig.target);
    
  })

  module.exports = router; 
