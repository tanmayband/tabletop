const commonUtils = require("../utils/commonUtils");

module.exports = {
    getRandomInventory: function()
    {
        var numItems = commonUtils.getRandomNumberInRange([2,5]);
        var inventoryItems = [];
        var itemNames = ["iron", "plastic", "wood", "silicon", "copper", "glass", "rubber", "steel"];
        for(i = 1; i < numItems; i++)
        {
            inventoryItems.push({"name": itemNames[commonUtils.getRandomNumberInRange([0, itemNames.length-1])], "invId": commonUtils.getRandomId(`${i}_inv`)});
        }
        return inventoryItems;
    },
    makeInventoryItem: function(someItem)
    {
        var invItem = someItem.toObject();
        invItem["invId"] = commonUtils.getRandomId(`inv`);
        console.log(someItem);
        console.log(invItem);
        return invItem;
    }
}