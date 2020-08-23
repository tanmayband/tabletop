const mongoose = require('mongoose');
const itemScheme = new mongoose.Schema({
    name : String,
    recipe : Object,        // {"glass": 2, "wood": 5, ...}
    craftingDC : Number,    // DC against dexterity
    tableReq : Boolean,
    attack: Number,
    defence: Number,
    defenceDC: Number,       // DC against dexterity
    unlocked: Boolean
});
module.exports = mongoose.model('item', itemScheme);