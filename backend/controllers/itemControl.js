const Item = require("../models/itemModel");
const playerUtils = require("../utils/playerUtils");
const itemUtils = require("../utils/itemUtils");
const inventoryUtils = require("../utils/inventoryUtils");
const commonUtils = require("../utils/commonUtils");
const constants = require("../utils/constants");

module.exports = {
    listRecipes: function(res)
    {
        Item.find(function (err, items) {
            if (err) return console.error(err);
            // console.log(items);
            var unlockedItems = [];
            var lockedItems = [];
            items.forEach(item => 
            {
                if(item["unlocked"])
                    unlockedItems.push(item)
                else
                    lockedItems.push(item)
            });
            res.send({ itemsUnlocked: unlockedItems, itemsLocked: lockedItems });
        });
    },

    // crafting table-less crafting
    craftItem: function(req, res)
    {
        var crafter = req.body["crafter"];
        var itemName = req.body["itemName"];
        playerUtils.getPlayer(crafter, (err, playerCrafter) => {
            if (err){
                res.send({"success": false});
                return console.error(err);
            }
            
            if(!playerCrafter.hasInventorySpace())
            {
                res.send({"success": false, "errorCode": 2});
            }
            else
            {
                itemUtils.getItem(itemName, async (err, itemFound) =>
                {
                    var crafterInventory = playerCrafter["inventory"];
                    // var crafterMaterials = crafterInventory
                    //                         .filter((invItem) => !invItem.hasOwnProperty("recipe"))
                    //                         .sort(commonUtils.sortByName);
                    var recipeMaterials = Object.keys(itemFound["recipe"]).sort(commonUtils.sortByName);

                    if (err){
                        res.send({"success": false});
                        return console.error(err);
                    }
                    else
                    {
                        var canCraft = true;
                        var crafterMaterials = [];
                        var i = 0
                        while(canCraft && i < recipeMaterials.length)
                        {
                            var recipMat = recipeMaterials[i];
                            var numRecipMat = itemFound["recipe"][recipMat];
                            for (var j = 0; j < crafterInventory.length; j++)
                            {
                                if (crafterInventory[j]["name"] === recipMat && numRecipMat > 0)
                                {
                                    crafterMaterials.push(crafterInventory[j]);
                                    numRecipMat -= 1;
                                }
                            }

                            if(numRecipMat > 0)
                            {
                                canCraft = false;
                            }

                            i++;
                        }

                        if(canCraft)
                        {
                            crafterMaterials.sort(commonUtils.sortByName);
                            var dexValue = playerCrafter.abilityValue(constants.abilities.DEX);
                            var dexCheck = playerCrafter.doDieRollForAbility(constants.abilities.DEX);
                            if(dexValue >= itemFound["craftingDC"] || dexCheck >= itemFound["craftingDC"])
                            {
                                recipeMaterials.forEach((recipMat) =>
                                {
                                    var numRecipMat = itemFound["recipe"][recipMat];
                                    for (var i = crafterInventory.length - 1; i >= 0; i--)
                                    {
                                        if (crafterInventory[i]["name"] === recipMat && numRecipMat > 0)
                                        {
                                            crafterInventory.splice(i, 1);
                                            numRecipMat -= 1;
                                        }
                                    }
                                });
                                
                                var craftedItem = inventoryUtils.makeInventoryItem(itemFound);
                                console.log(craftedItem);
                                crafterInventory.push(craftedItem);
                                playerCrafter["inventory"] = crafterInventory;
                                await playerCrafter.save();
                                res.send({"success": true, "crafterInv": crafterInventory,
                                    "dexCheck": dexCheck
                                });
                            }
                            else
                            {
                                var lostMaterials = itemUtils.craftFail(dexCheck, itemFound["craftingDC"], crafterMaterials);
                                lostMaterials.forEach((lostMat) =>
                                {
                                    var lostIdx = crafterInventory.indexOf(lostMat);
                                    crafterInventory.splice(lostIdx, 1);
                                });
                                playerCrafter["inventory"] = crafterInventory;
                                await playerCrafter.save();

                                res.send({"success": false, "errorCode": 3, "crafterInv": crafterInventory,
                                    "dexCheck": dexCheck,
                                    "lostMaterials": lostMaterials
                                });
                            }
                        }
                        else
                        {
                            res.send({"success": false, "errorCode": 1});
                        }
                    }
                });

            }
        })
        
    }


}