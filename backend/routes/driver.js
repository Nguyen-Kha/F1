const router = require('express').Router();
let Driver = require('../models/driver.model');

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
// RETURNS: [ {year, name, totalPoints, results[race, place]} ]
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
// RETURNS: [ {year, name, totalPoints} ]
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

// Get Race Results for certain Year
// RETURNS: [ {year, name, totalPoints, results{} } ]
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
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get historical results for specific Race
// RETURNS: [ {year, name, totalPoints, results{} } ]
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
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get Single Driver's stats for all years
// RETURNS: everything about the driver
router.route('/name/:id').get((request, response) => {
    let driverName = request.params.id;
    Driver.find({name: driverName})
        .then(resultsMongo => {
            if(resultsMongo.length == 1){
                response.status(200).json(resultsMongo[0]);
            }
            else{
                response.status(200).json(resultsMongo);
            }
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get Driver's Fastest laps
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

            if(newResults.length == 1){
                response.status(200).json(newResults[0]);
            }
            else{
                response.status(200).json(newResults);
            }
            
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


/*
// Get all unplaced reasons (historical)
// Filter for NOT number, NOT ""
// Consider using regex, "OR" statement
// AND gives the wrong query, construct the json object to figure out why
router.route('/DNF').get((request, response) => {
    // Driver.find({results: {$elemMatch: {place: "DNF"}}})
    // Driver.find({ $or:[ {results: {$elemMatch: {place: '/^[A-Za-z]+$/'}}},
    //      {results: {$elemMatch: {place: {'$ne': '^(?!\s*$).+'}}}} ]})
    Driver.find(
        {results: {
            $elemMatch: {
                place: {
                    $regex: "/^[A-Za-z]+$/",
                }
            }
        }
    })
        .then(resultsMongo => {
            response.status(200).json(resultsMongo);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get unplaced for year
router.route('/DNF/year/:id').get((request, response) => {
    let yearNumber = request.params.id;
    Driver.find()
    .then(resultsMongo => {

    })
    .catch(err => response.status(400).json('Error: ' + err));
})

// Get unplaced for driver
router.route('/DNF/name/:id').get((request, response) => {
    let driverName = request.params.id;
    Driver.find()
    .then(resultsMongo => {

    })
    .catch(err => response.status(400).json('Error: ' + err));
})

// Get unplaced for year and race
router.route('/DNF/year/:id/race/:id2').get((request, response) => {
    let yearNumber = request.params.id;
    let raceName = request.params.id2;
    Driver.find()
    .then(resultsMongo => {

    })
    .catch(err => response.status(400).json('Error: ' + err));
})
*/


module.exports = router;