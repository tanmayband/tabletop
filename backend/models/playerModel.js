const mongoose = require('mongoose');
const commonUtils = require("../utils/commonUtils");

const playerSchema = new mongoose.Schema({
    name : String,
    health : Number,
    armour : Number,
    abilities : [ Number ],
    inventory : [ Object ]
});

playerSchema.methods.hasInventorySpace = function () {
    return this.inventory.length < 5;
}

playerSchema.methods.abilityValue = function (abilityIdx) {
    return this.abilities[abilityIdx];
}

playerSchema.methods.doDieRollForAbility = function(abilityIdx)
{
    var randomDie = commonUtils.getRandomNumberInRange([1,20]);
    var modifier = Math.floor((this.abilities[abilityIdx] - 10)/2);
    return (randomDie + modifier);
},
module.exports = mongoose.model('Testplayer', playerSchema);