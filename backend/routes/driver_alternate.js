// Below are the alternate ways we can call the APIs
// I'm leaving this in here so I have notes for myself

router.get('/', async(request, response) => {
    const drivers = await Driver.find({});
    response.json(drivers);
    // Either one works
    // const drivers = await Driver.find()
    //     .then(drivers => res.json(drivers))
    //     .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/race/:race_id/year/:year_id', async(request, response) => {
    let raceName = request.params.race_id;
    let yearNumber = request.params.year_id;
    const results = await Driver.find({year: yearNumber, results: {$elemMatch: { race: raceName}}})
    response.json(results)
});

router.get('/year/:id', async(request, response) => {
    let singleYear = request.params.id; // TODO
    const yearResults = await Driver.find({year: singleYear});
    response.json(yearResults);
});

router.get('/year/:id/tp/:id2', async(request, response) => {
    let singleYear = request.params.id;
    let singleTP = request.params.id2;
    const results = await Driver.find({year: singleYear, totalPoints: singleTP})
    response.json(results)
});

router.get('/name/:id', async(request, response) => {
    // TODO: something to parse for the name, or maybe a body param
    let driverName = request.params.id;
    // console.log(driverName); If we send localhost:3000/api/driver/name/Lewis%20Hamilton
    // it will print driverName as 'Lewis Hamilton'
    const nameResults = await Driver.find({name: driverName})
    response.json(nameResults);
});

router.route('/name/:id').get((request, response) => {
    let driverName = request.params.id;
    Driver.find({name: driverName}).select({year: 1, name: 1, 'results.race': 1})
        .then(results => {
            response.status(200).json(results);
        })
        .catch(err => response.status(400).json('Error: ' + err));
});

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