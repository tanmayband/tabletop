module.exports = {
    getRandomNumberInRange: function(rangeArray)
    {
        // both inclusive
        return Math.floor(Math.random() * (rangeArray[1] - rangeArray[0] + 1)) + rangeArray[0];
    },

    getRandomId: function(prefix)
    {
        return prefix + "_" + Date.now() + "_" + this.getRandomNumberInRange([1,50]);
    },

    sortByName: function(a, b)
    {
        return a["name"] - b["name"];
    }

    // doDieRollWithModifier: function(modifier)
    // {
    //     var randomDie = getRandomNumberInRange([1,20]);
    //     return (randomDie + modifier);
    // },

    // getAbilityModifer: function(ability)
    // {
    //     return Math.floor((ability - 10)/2);
    // }
}