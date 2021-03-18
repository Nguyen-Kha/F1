const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Set up Express
const app = express();
app.use(cors());
app.use(express.json());

// Set up Port
const port = process.env.PORT || 5000;
console.log('Starting Server');
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// Connect to MongoDB
console.log('Connecting to MongoDB');
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// Set up Routes from routes folder
const driverRouter = require('./routes/driver');
const driverModel = require('./models/driver.model');
app.use('/api/driver', driverRouter);

console.log('collection name: ' + driverModel.collection.collectionName);
// console.log(driverModel.countDocuments({} , function(err, count){
//     console.log('Number of docs: ' + count);
// })); 