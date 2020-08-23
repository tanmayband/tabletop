const express = require('express');
const app = module.exports = express();
const itemController = require('../controllers/itemControl');

app.get('/listRecipes', (req, res) => {
    console.log("/listRecipes");
    console.log(req.body);
    itemController.listRecipes(res);
  });

app.post('/craftItem', (req, res) => {
    console.log("/moveItem");
    console.log(req.body);
    itemController.craftItem(req, res);
  });