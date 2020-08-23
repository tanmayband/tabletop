const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const playerRoutes = require("./routes/playerRoutes");
const itemRoutes = require("./routes/itemRoutes");
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(playerRoutes);
app.use(itemRoutes);
app.use(inventoryRoutes);

mongoose.connect('mongodb://localhost/dnd', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to players!");
});

app.listen(port, () => console.log(`Listening on port ${port}`));