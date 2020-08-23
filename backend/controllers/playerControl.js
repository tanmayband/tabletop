const playerUtils = require("../utils/playerUtils");
const Player = require("../models/playerModel");

module.exports = {
    getAllPlayers: function(res)
    {
        playerUtils.getAllPlayers(function(players)
        {
            res.send({ players: players });
        })
    },

    makeRandomPlayer: function(req, res)
    {
        if(req.body["name"].length > 0)
        {
        var newPlayer = playerUtils.getRandomPlayer(req.body["name"]);
        newPlayer.save(function (err, player) {
            if (err) return console.error(err);
            res.send(newPlayer);
            });
        }
    },


}