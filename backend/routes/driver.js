const router = require('express').Router();
let Driver = require('../models/driver.model');

// Get all Drivers
router.route('/').get((request, response) => {
    Driver.find({})
        .then(driver => {
            response.status(200).json(driver);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get performance for specifc year
router.route('/year/:id').get((request, response) => {
    let singleYear = request.params.id;
    Driver.find({year: singleYear})
        .then(results => {
            response.status(200).json(results);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// GET NAME AND PLACE - TESTING UNIT
router.route('/year/:id/tp/:id2').get((request, response) => {
    let singleYear = request.params.id;
    let singleTP = request.params.id2;
    Driver.find({year: singleYear, totalPoints: singleTP})
        .then(results => {
            response.status(200).json(results);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// {year: 2000, results:{ $elemMatch: {race: "AUS", fastestLap:true}}}
// Get Race Results for certain Year
router.route('/race/:race_id/year/:year_id').get((request, response) => {
    let raceName = request.params.race_id;
    let yearNumber = request.params.year_id;
    Driver.find({year: yearNumber, results: {$elemMatch: { race: raceName}}})
        .then(results => {
            response.status(200).json(results);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get historical results for specific Race
router.route('/race/:id').get((request, response) => {
    let raceName = request.params.id;
    Driver.find({ "results.race": raceName})
        .then(results => {
            response.status(200).json(results);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get Single Driver for all years
router.route('/name/:id').get((request, response) => {
    let driverName = request.params.id;
    Driver.find({name: driverName}).select({year: 1, name: 1, 'results.race': 1})
        .then(results => {
            // Potentially construct the JSON response from the mongoose JSON
            response.status(200).json(results);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get Driver's Fastest laps
router.route('/name/:id/fastestLap').get((request, response) => {
    let driverName = request.params.id;
    Driver.find({name: driverName, results: {$elemMatch: { fastestLap: true}}})
        .then(results => {
            response.status(200).json(results);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get Fastest Laps per year
router.route('/year/:id/fastestLap').get((request, response) => {
    let yearNumber = request.params.id;
    Driver.find({year: yearNumber, results: {$elemMatch: {fastestLap: true}}})
        .then(resultsMongo => {
            // Construct the JSON response from the mongoose JSON
            let newResults = [];
            // console.log(results[0].name);
            for(let i = 0; i < resultsMongo.length; i++){
                // console.log(results[i] + '\n');
                let singleResult = {};
                let singleRaceArray = []; // For standardization even tho its a size 1 array
                singleResult.year = resultsMongo[i].year;
                singleResult.name = resultsMongo[i].name;
                singleResult.totalPoints = resultsMongo[i].totalPoints;
                for(let j = 0; j < resultsMongo[i].results.length; j++){
                    if(resultsMongo[i].results[j].fastestLap == true){
                        singleRaceArray.push(resultsMongo[i].results[j]);
                    }
                }
                singleResult.results = singleRaceArray;
                newResults.push(singleResult);
            }
            response.status(200).json(newResults);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

module.exports = router;