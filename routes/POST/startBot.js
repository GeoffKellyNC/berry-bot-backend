const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { berry } = require('../../twitch/berry');


const startBerry = () => {
    berry(); 
  } 



router.post("/", (req, res) => {   // Start Berry
    console.log('Server Starting Berry...')
    const { data } = req.body;
    if (data === 'startBot'){
      startBerry();
    }
    res.sendStatus(200);
  })

  module.exports = router;