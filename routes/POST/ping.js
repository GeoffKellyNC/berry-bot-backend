const express = require('express');
const router = express.Router();



router.post('/', (req, res) => {
    const { data } = req.body;
    if (data === 'ping'){
        res.sendStatus(200);
    }else{
        res.sendStatus(400);
    }
})

module.exports = router;