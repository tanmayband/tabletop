import React from 'react';
import axios from 'axios';

import './gameView.css';

class GameView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: "",
            allPlayersData: [],
            allItemsData: {
                itemsUnlocked: [],
                itemsLocked: []
            },
            allMaterials: []
        };

    }

    componentDidMount() {
        this.getAllData();
    }

    getAllData = () => 
    {
        // TODO: club all these into a single request later

        axios.get('/getPlayers')
        .then(res => {
            const response_data = res.data;
            console.log(response_data["players"]);
            this.setState({allPlayersData: response_data["players"]});

            this.collectAllMaterials(response_data["players"]);
        });

        axios.get('/listRecipes')
        .then(res => {
            const response_data = res.data;
            console.log(response_data);
            this.setState({allItemsData: response_data});
        });
    }

    makePlayer = (playerObj) =>
    {
        axios.post('/makePlayer', playerObj)
        .then(res => {
            const response_data = res.data;
            console.log(response_data);
            this.setState(prevState => {
                let allPlayersData = Object.assign([], prevState.allPlayersData);
                allPlayersData.push(response_data);
                return { allPlayersData };
            });
        });
    }

    makePlayerButton = (e) =>
    {
        e.preventDefault();
        if(this.state.playerName.length > 0)
        {
            this.makePlayer({"name": this.state.playerName});
            this.setState({playerName: ""});
        }
    }

    handlePlayerNameChange = (evnt) =>
    {
        this.setState({playerName: evnt.target.value});
    }

    handleInventoryItemOwnerChange = (evnt) =>
    {
        this.server_stage = evnt.target.value;
    }

    getInventoryName = (playerObj, invIdx) =>
    {
        return(
            playerObj["inventory"][invIdx] ? 
                <div>
                    {playerObj["inventory"][invIdx]["name"] }
                    <br/>
                    <PlayerPicker
                        invId={playerObj["inventory"][invIdx]["invId"]}
                        allPlayersData={this.state.allPlayersData.filter(player => player["name"] !== playerObj["name"])}
                        actionTaken={(receiver, invId) => this.moveInventoryItem(playerObj["name"], receiver, invId)}
                        showRemove={true}
                    />
                </div>
            : null
        );
    }

    moveInventoryItem = (giver, receiver, invId) =>
    {
        console.log(giver + " gives " + invId + " to " + receiver);
        if(receiver !== "-1")
        {
            axios.post('/moveInventory',
            {
                "giver": giver,
                "receiver": receiver,
                "invId": invId
            })
            .then(res => {
                const response_data = res.data;
                console.log(response_data);
                if(response_data["success"])
                {
                    var changedAllPlayersData = this.state.allPlayersData;
                    changedAllPlayersData.filter(p => p["name"] === giver)[0]["inventory"] = response_data["giverInv"]
                    if(receiver !== "99")
                    {
                        changedAllPlayersData.filter(p => p["name"] === receiver)[0]["inventory"] = response_data["receiverInv"]
                    }
                    else
                    {
                        this.collectAllMaterials(changedAllPlayersData);
                    }
                    this.setState({allPlayersData: changedAllPlayersData});
                }
            });
        }
    }

    makeAbilityDiv = (playerAbility) =>
    {
        return (
            <div>{playerAbility}<br/><DieRoll ability={playerAbility}/></div>
        )
    }

    collectAllMaterials = (allPlayersData) =>
    {
        var allMaterials = [];
        // TODO: Avoid this second loop, use the same one as populating the players table
        allPlayersData.forEach((player) => {
            allMaterials = allMaterials.concat(player["inventory"].filter((invItem) => !invItem.hasOwnProperty("recipe")));
        });
        this.setState({allMaterials: allMaterials});
        
    }

    makeCraftableRow = () => 
    {
        var allMaterials = this.state.allMaterials;
        var allRows = [];
        this.state.allItemsData.itemsUnlocked.forEach((item, i) => 
        {
            var recipeMaterials = Object.keys(item["recipe"]);
            var canCraft = true;
            var matIdx = 0;
            var recipeString = "";
            while(matIdx < recipeMaterials.length)
            {
                let currMaterial = recipeMaterials[matIdx];
                var matCount = allMaterials.filter(invItem => invItem["name"].toLowerCase() === currMaterial.toLowerCase()).length;
                if(matCount < item["recipe"][recipeMaterials[matIdx]])
                {
                    canCraft = false;
                }

                recipeString += (currMaterial + ": " + item["recipe"][currMaterial] + "\n");
                matIdx += 1;
            }

            allRows.push(
                <tr key={item["name"] + i}>
                    <td>{item["name"]}</td>
                    <td style={{"textAlign": "left"}}>{recipeString}</td>
                    <td>{item["craftingDC"]}</td>
                    <td>{canCraft ? "YES" : ""}</td>
                    <td>
                        <PlayerPicker
                            invId={item["name"]}
                            allPlayersData={this.state.allPlayersData}
                            actionTaken={(crafter, invId) => this.craftItem(crafter, invId)}
                        />
                    </td>
                </tr>
            );
        })
        return allRows;
    }

    craftItem = (crafter, itemName) =>
    {
        console.log(crafter + " attempts crafting " + itemName);
        if(crafter !== "-1")
        {
            axios.post('/craftItem',
            {
                "crafter": crafter,
                "itemName": itemName
            })
            .then(res => {
                const response_data = res.data;
                console.log(response_data);
                var changedAllPlayersData = this.state.allPlayersData;
                if(response_data["success"])
                {
                    changedAllPlayersData.filter(p => p["name"] === crafter)[0]["inventory"] = response_data["crafterInv"]
                    this.collectAllMaterials(changedAllPlayersData);
                    this.setState({allPlayersData: changedAllPlayersData});
                }
                else
                {
                    switch(response_data["errorCode"])
                    {
                        case 1:
                        {
                            console.log("Not enough materials!");
                            break;
                        }
                        case 2:
                        {
                            console.log("No space!");
                            break;
                        }
                        case 3:
                        {
                            console.log(crafter + " rolls " + response_data["dexCheck"] + " and loses...");
                            console.log(response_data["lostMaterials"]);

                            changedAllPlayersData.filter(p => p["name"] === crafter)[0]["inventory"] = response_data["crafterInv"]
                            this.collectAllMaterials(changedAllPlayersData);
                            this.setState({allPlayersData: changedAllPlayersData});
                            break;
                        }
                        default:
                        {
                            break;
                        }
                    }                    
                }
            });
        }
    }


    render() {
        return (
            <div className="bg">
                <div className="game-div">
                    <input
                        onChange={this.handlePlayerNameChange}
                        value={this.state.playerName}
                    />
                    <button onClick={this.makePlayerButton}>
                        Add player
                    </button>

                    <table className="player-table">
                        <colgroup>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th rowSpan="2">Name</th>
                                <th rowSpan="2">Health</th>
                                <th rowSpan="2">Armour</th>
                                <th colSpan="6">Abilities</th>
                                <th colSpan="5" rowSpan="2">Inventory</th>
                            </tr>
                            <tr>
                                {/* Abilities */}
                                    <th>Strength</th>
                                    <th>Dexterity</th>
                                    <th>Constitution</th>
                                    <th>Intelligence</th>
                                    <th>Wisdom</th>
                                    <th>Charisma</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.allPlayersData.map((player, i) => (
                                <tr key={player["name"] + i}>
                                    <td>{player["name"]}</td>
                                    <td>{player["health"]}</td>
                                    <td>{player["armour"]}</td>
                                    <td>{this.makeAbilityDiv(player["abilities"][0])}</td>
                                    <td>{this.makeAbilityDiv(player["abilities"][1])}</td>
                                    <td>{this.makeAbilityDiv(player["abilities"][2])}</td>
                                    <td>{this.makeAbilityDiv(player["abilities"][3])}</td>
                                    <td>{this.makeAbilityDiv(player["abilities"][4])}</td>
                                    <td>{this.makeAbilityDiv(player["abilities"][5])}</td>
                                    <td>{this.getInventoryName(player, 0)}</td>
                                    <td>{this.getInventoryName(player, 1)}</td>
                                    <td>{this.getInventoryName(player, 2)}</td>
                                    <td>{this.getInventoryName(player, 3)}</td>
                                    <td>{this.getInventoryName(player, 4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <table className="player-table">
                        <colgroup>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                            <col className="player-wide-col"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Recipe</th>
                                <th>Dex</th>
                                <th>Craftable?</th>
                                <th>Crafter</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.makeCraftableRow()
                            }
                            {
                                this.state.allItemsData.itemsLocked.map((item, i) => (
                                    <tr key={item["name"] + i} className="item-row-locked">
                                        <td>{item["name"]}</td>
                                        <td colSpan="2">unknown</td>
                                        <td colSpan="2"></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                </div>
            </div>
        );
    }
}

class DieRoll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRoll: 0,
        }

        this.ability = this.props.ability;
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.ability !== this.ability)
        {
            this.ability = this.props.ability;
        }
    }

    getDieRoll = () =>
    {
        var randomDie = Math.round(Math.random() * 20);
        var modifier = Math.floor((this.ability - 10)/2);
        this.setState({currentRoll: (randomDie + modifier)});
    }


    render() {
        return (
            <div style={{"display": "flex"}}>
                <button onClick={this.getDieRoll}>
                    Roll:
                </button>
                <span style={{"fontSize": "12px"}}>{this.state.currentRoll}</span>
            </div>
        );
    }
}

class PlayerPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allPlayersData: props.allPlayersData,
            currentOption: "-1",
            invId: props.invId
        };
        this.showRemove = props.showRemove;
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.allPlayersData.length !== this.state.allPlayersData.length)
        {
            this.setState({allPlayersData: this.props.allPlayersData});
        }

        if(prevProps.invId !== this.state.invId)
        {
            this.setState({invId: this.props.invId});
        }
    }



    handleSelectItemChange = (evnt) =>
    {
        this.setState({currentOption: evnt.target.value});
    }

    confirmAction = (e) =>
    {
        e.preventDefault();        
        if(this.state.currentOption !== "-1")
        {
            // call parent function
            if(this.props.actionTaken != null)
            {
                this.props.actionTaken(this.state.currentOption, this.state.invId);
                this.setState({currentOption: "-1"});
            }
        }
    }


    render() {
        return (
            <div style={{"display": "flex"}}>
                <select
                    onChange={this.handleSelectItemChange}
                    style={{"width": "50px"}}
                    value={this.state.currentOption}
                >
                    <option value="-1"></option>
                    {this.state.allPlayersData.map((player, i) => (
                        <option key={player["name"] + i} value={player["name"]}>{player["name"]}</option>
                    ))}
                    {this.showRemove ? <option value="99">-- DROP --</option> : null}
                </select>
                <button onClick={this.confirmAction}>
                    Go
                </button>
            </div>
        );
    }
}

export default GameView;