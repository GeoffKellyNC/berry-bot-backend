const express = require('express')
const router = express.Router();

const { votingBerry } = require('../../twitch/votingBerry')

const startVotingBerry = () => {
    votingBerry();
    }




router.post("/", (req, res) => {
    const { data } = req.body
    if (data === 'startVote'){
        startVotingBerry();
    }

    res.sendStatus(200);
})


module.exports = router;