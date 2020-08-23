const express = require('express');
const app = module.exports = express();
const playerController = require('../controllers/playerControl');


app.get('/getPlayers', (req, res) => {
    console.log("/getPlayers");
    playerController.getAllPlayers(res);
});

app.post('/makePlayer', (req, res) => {
    console.log("/makePlayer");
    console.log(req.body);
    playerController.makeRandomPlayer(req, res);
});
