const router = require('express').Router();
let Driver = require('../models/driver.model');

// Get all Drivers
router.route('/').get((request, response) => {
    Driver.find({})
        .then(driver => {
            response.json(driver);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// Get performance for specifc year
router.route('/year/:id').get((request, response) => {
    let singleYear = request.params.id;
    Driver.find({year: singleYear})
        .then(results => {
            response.json(results);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// GET NAME AND PLACE - TESTING UNIT
router.route('/year/:id/tp/:id2').get((request, response) => {
    let singleYear = request.params.id;
    let singleTP = request.params.id2;
    Driver.find({year: singleYear, totalPoints: singleTP})
        .then(results => {
            response.json(results);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

// {year: 2000, results:{ $elemMatch: {race: "AUS", fastestLap:true}}}
// Get Race Results for certain Year
router.route('/race/:race_id/year/:year_id').get((req, res) => {
    let raceName = req.params.race_id;
    let yearNumber = req.params.year_id;
    Driver.find({year: yearNumber, results: {$elemMatch: { race: raceName}}})
        .then(results => {
            res.json(results);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get Single Driver for all years
router.route('/name/:id').get((request, response) => {
    let driverName = request.params.id;
    Driver.find({name: driverName})
        .then(results => {
            response.json(results);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});



module.exports = router;