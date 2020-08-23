const Player = require("../models/playerModel");
const commonUtils = require("../utils/commonUtils");
const inventoryUtils = require("../utils/inventoryUtils");

module.exports = {
    getRandomPlayer: function(pname)
    {
        return new Player({ 
            name: pname,
            health: 100,
            armour: 25,
            abilities: getRandomAbilities(true),
            inventory: inventoryUtils.getRandomInventory()
        });
    },
    getAllPlayers: function(callback)
    {
        Player.find(function (err, players) {
            if (err) return console.error(err);
            // console.log(players);
            callback(players);
        });
    },
    getPlayer: function(pname, callback)
    {
        Player.findOne({ name: pname }, function (err, playerFound) {
            callback(err, playerFound);
        });
    }
}

function getRandomAbilities(useNegative)
{
    // returns array of [strength, dexterity, constitution, intelligence, wisdom, charisma].
    // if useNegative, then include negative ability values.

    var abilityRange = useNegative ? [1,21] : [12,21]
    var abilityValues = [];
    for(i = 0; i <= 5; i++)
    {
        abilityValues[i] = commonUtils.getRandomNumberInRange(abilityRange);
    }
    return abilityValues;
}