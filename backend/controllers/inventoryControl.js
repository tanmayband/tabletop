const Player = require("../models/playerModel");
const playerUtils = require("../utils/playerUtils");

module.exports = {
    moveInventory: function(req, res)
    {
        if(req.body["giver"].length > 0 && req.body["invId"].length > 0)
        {
            if(req.body["receiver"] !== "99")
            {
                playerUtils.getPlayer(req.body["receiver"], async function (err, playerReceiver) {
                    if (err){
                        res.send({"success": false});
                        return console.error(err);
                    }
                    console.log(playerReceiver);
                    
                    if(!playerReceiver.hasInventorySpace())
                    {
                        res.send({"success": false});
                    }
                    else
                    {
                        playerUtils.getPlayer(req.body["giver"], async function (err, playerGiver) {
                            if (err){
                                res.send({"success": false});
                                return console.error(err);
                            }
                            console.log(playerGiver);
                            
                            var giverInv = playerGiver["inventory"];
                            var receiverInv = playerReceiver["inventory"];
                            var invId = req.body["invId"];
                            var removedItem = giverInv.filter(e => e["invId"] == invId)[0];
                            var itemIdx = giverInv.indexOf(removedItem);
                            
                            if(itemIdx >= 0)
                            {
                                giverInv.splice(itemIdx,1);
                                playerGiver["inventory"] = giverInv;
                                await playerGiver.save();

                                receiverInv.push(removedItem);
                                playerReceiver["inventory"] = receiverInv;
                                await playerReceiver.save();

                                res.send({"success": true, "giverInv": giverInv, "receiverInv": receiverInv});
                            }
                            else
                            {
                                res.send({"success": false});
                            }

                        });
                    }
                });
            }
            else
            {
                playerUtils.getPlayer(req.body["giver"], async function (err, playerGiver) {
                    if (err){
                        res.send({"success": false});
                        return console.error(err);
                    }
                    console.log(playerGiver);
                    
                    if(!playerGiver.hasInventorySpace())
                    {
                        res.send({"success": false});
                    }
                    else
                    {
                        var giverInv = playerGiver["inventory"];
                        var invId = req.body["invId"];
                        var removedItem = giverInv.filter(e => e["invId"] == invId)[0];
                        var itemIdx = giverInv.indexOf(removedItem);
                        
                        if(itemIdx >= 0)
                        {
                            giverInv.splice(itemIdx,1);
                            playerGiver["inventory"] = giverInv;
                            await playerGiver.save();

                            res.send({"success": true, "giverInv": giverInv});
                        }
                        else
                        {
                            res.send({"success": false});
                        }
                    }
                });
            }
        }
        else
        {
            res.send({"success": false});
        }
    }
}