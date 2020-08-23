const express = require('express');
const app = module.exports = express();
const inventoryController = require('../controllers/inventoryControl');

app.post('/moveInventory', (req, res) => {
    console.log("/moveInventory");
    console.log(req.body);
    inventoryController.moveInventory(req, res);
  });