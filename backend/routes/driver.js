const router = require('express').Router();
let Driver = require('../models/driver.model');

// Get all Drivers
router.get('/', async(request, response) => {
    const drivers = await Driver.find({});
    response.json(drivers);
    // Either one works
    // const drivers = await Driver.find()
    //     .then(drivers => res.json(drivers))
    //     .catch(err => res.status(400).json('Error: ' + err));
});

// Get performance for specifc year
router.get('/year/:id', async(request, response) => {
    let singleYear = request.params.id; // TODO
    const yearResults = await Driver.find({year: singleYear});
    response.json(yearResults);
});

// GET NAME AND PLACE - TESTING UNIT
router.get('/year/:id/tp/:id2', async(request, response) => {
    let singleYear = request.params.id;
    let singleTP = request.params.id2;
    const results = await Driver.find({year: singleYear, totalPoints: singleTP})
    response.json(results)
});

// {year: 2000, results:{ $elemMatch: {race: "AUS", fastestLap:true}}}

// Get Single Driver for all years
router.get('/name/:id', async(request, response) => {
    // TODO: something to parse for the name, or maybe a body param
    let driverName = request.params.id;
    // console.log(driverName); If we send localhost:3000/api/driver/name/Lewis%20Hamilton
    // it will print driverName as 'Lewis Hamilton'
    const nameResults = await Driver.find({name: driverName})
    response.json(nameResults);
});

// router.route('/').get((req, res) => {
//     Driver.find()
//         .then(driver => res.json(driver))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

/*
router.route('/add').post((req, res) => {
    const year = Number(req.body.year);
    const name = req.body.name;
    // Some other stuff
    const newDriverStat = new Driver({
        year,
        name,
    });

    newDriverStat.save()
        .then( () => res.json('Driver added'))
        .catch(err => res.status(400).json('Error: ' + err));
});
*/

module.exports = router;