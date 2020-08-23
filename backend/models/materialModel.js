const materialScheme = new mongoose.Schema({
    name : String,
    rarityDC: Number,       // reusing same DC structure as "ease-for-finding"
    attack: Number,
    defence: Number,
    defenceDC: Number       // DC against dexterity 
});
module.exports = mongoose.model('material', materialScheme);