const router = require('express').Router();
let Driver = require('../models/driver.model');

// TODO: Add if statement in the case that there is only one object
// so it doesn't return an array of 1 object
// Only for certain objects that can only have 1 result

// Get all Drivers
// RETURNS: the entire document
router.route('/').get((request, response) => {
    Driver.find({})
        .then(driver => {
            response.status(200).json(driver);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get performance for specifc year
// Use for table
// Returns: year, name, totalPoints, results[race, place]
router.route('/year/:id').get((request, response) => {
    let singleYear = request.params.id;
    Driver.find({year: singleYear})
        .then(resultsMongo => {
            let newResults = [];
            for(let i = 0; i < resultsMongo.length; i++){
                let singleResult = {};
                let singleRaceArray = []; 
                singleResult.year = resultsMongo[i].year;
                singleResult.name = resultsMongo[i].name;
                singleResult.totalPoints = resultsMongo[i].totalPoints;

                for(let j = 0; j < resultsMongo[i].results.length; j++){
                    let singleRaceObject = {};
                    singleRaceObject.race = resultsMongo[i].results[j].race;
                    singleRaceObject.place = resultsMongo[i].results[j].place;
                    singleRaceArray.push(singleRaceObject);
                }

                singleResult.results = singleRaceArray;
                newResults.push(singleResult);
            }
            response.status(200).json(newResults);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get Total Points in a Year
router.route('/year/:id/tp/:id2').get((request, response) => {
    let singleYear = request.params.id;
    let singleTP = request.params.id2;
    Driver.find({year: singleYear, totalPoints: singleTP})
        .then(resultsMongo => {
            let newResults = [];
            for(let i = 0; i < resultsMongo.length; i++){
                let singleResult = {};
                singleResult.year = resultsMongo[i].year;
                singleResult.name = resultsMongo[i].name;
                singleResult.totalPoints = resultsMongo[i].totalPoints;
                newResults.push(singleResult);
            }
            response.status(200).json(newResults);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// {year: 2000, results:{ $elemMatch: {race: "AUS", fastestLap:true}}}
// Get Race Results for certain Year
router.route('/race/:race_id/year/:year_id').get((request, response) => {
    let raceName = request.params.race_id;
    let yearNumber = request.params.year_id;
    Driver.find({year: yearNumber, results: {$elemMatch: { race: raceName}}})
        .then(resultsMongo => {
            let newResults = [];
            for(let i = 0; i < resultsMongo.length; i++){
                let singleResult = {};
                singleResult.year = resultsMongo[i].year;
                singleResult.name = resultsMongo[i].name;
                singleResult.totalPoints = resultsMongo[i].totalPoints;

                for(let j = 0; j < resultsMongo[i].results.length; j++){
                    if(resultsMongo[i].results[j].race == raceName){
                        singleResult.results = resultsMongo[i].results[j];
                    }
                }
                newResults.push(singleResult);
            }
            response.status(200).json(newResults);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get historical results for specific Race
router.route('/race/:id').get((request, response) => {
    let raceName = request.params.id;
    Driver.find({ "results.race": raceName})
        .then(resultsMongo => {
            let newResults = [];
            for(let i = 0; i < resultsMongo.length; i++){
                let singleResult = {};
                singleResult.year = resultsMongo[i].year;
                singleResult.name = resultsMongo[i].name;
                singleResult.totalPoints = resultsMongo[i].totalPoints;

                for(let j = 0; j < resultsMongo[i].results.length; j++){
                    if(resultsMongo[i].results[j].race == raceName){
                        singleResult.results = resultsMongo[i].results[j];
                    }
                }
                newResults.push(singleResult);
            }
            response.status(200).json(newResults);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get Single Driver for all years
router.route('/name/:id').get((request, response) => {
    let driverName = request.params.id;
    Driver.find({name: driverName})
        .then(resultsMongo => {
            // Potentially construct the JSON response from the mongoose JSON
            response.status(200).json(resultsMongo);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get Driver's Fastest laps
// TODO: if statement for single array
router.route('/name/:id/fastestLap').get((request, response) => {
    let driverName = request.params.id;
    Driver.find({name: driverName, results: {$elemMatch: { fastestLap: true}}})
        .then(resultsMongo => {
            let newResults = [];
            for(let i = 0; i < resultsMongo.length; i++){
                let singleResult = {};
                let singleRaceArray = []; // For standardization
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

// Get Fastest Laps per year
router.route('/year/:id/fastestLap').get((request, response) => {
    let yearNumber = request.params.id;
    Driver.find({year: yearNumber, results: {$elemMatch: {fastestLap: true}}})
        .then(resultsMongo => {
            let newResults = [];
            for(let i = 0; i < resultsMongo.length; i++){
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

// Get all DNF reasons (historical)

// Get DNFs for year

// Get DNFs for driver

// Get DNFs for year and race

module.exports = router;