const Item = require("../models/itemModel");
const commonUtils = require("../utils/commonUtils");

module.exports = {
    getItem: function(itemName, callback)
    {
        Item.findOne({ name: itemName }, function (err, itemFound) {
            callback(err, itemFound);
        });
    },

    craftFail: function(dexCheck, targetDex, recipeMaterials)
    {
        var lostMaterials = [];
        if(dexCheck < targetDex)
        {
            var alpha = (targetDex - dexCheck)/targetDex;       // the percentage of required materials lost
            var numLost = Math.floor(alpha * recipeMaterials.length);
            
            // sort recipeMaterials first by rarity (common items first)
            // TOCHECK: and within each rarity, sort by number required (more items first)
            recipeMaterials.sort((a,b) => a["rarityDC"] - b["rarityDC"]);

            lostMaterials = recipeMaterials.slice(0, numLost);  // elements lost from 0 to numLost-1.            
        }

        return lostMaterials;
    }
    
}