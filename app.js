const express = require('express');
const moment = require('moment');
const connect = require('./db');
const seed = require('./seed');
const app = express();

function createOrArray(query) {
    if (query.$or == undefined) {
        query.$or = [];
    }
}

app.get('/list', async (req, res) => {
    const client = await connect();
    const db = client.db('netflix');
    const collection = db.collection('shows');

    const count = await collection.countDocuments();
    console.log(count);

    let query = {};

    // Separating movies and TV shows
    if (req.query.type) {
        createOrArray(query)
        query.$or.push({ type: req.query.type });
    }

    // Searching with movie name
    if (req.query.name) {
        createOrArray(query)
        query.$or.push({ title: { $regex: req.query.name, $options: 'i' } });
    }

    // Searching with movie director
    if (req.query.director) {
        createOrArray(query)
        query.$or.push({ director: { $regex: req.query.director, $options: 'i' } });
    }

    // Searching with movie cast
    if (req.query.cast) {
        createOrArray(query)
        query.$or.push({ cast: { $regex: req.query.cast, $options: 'i' } });
    }

    // Range queries on release_year
    if (req.query.startYear && req.query.endYear) {
        createOrArray(query)
        query.$or.push({
            release_year: {
                $gte: req.query.startYear,
                $lte: req.query.endYear
            }
        });
    }


    // Filter by rating
    if (req.query.rating) {
        createOrArray(query)
        query.$or.push({ rating: req.query.rating });
    }


    // Sorting by date_added and release_year
    if (req.query.sortBy && req.query.sortOrder) {
        const sort = {};
        if (req.query.sortBy === 'date_added') {
            sort[req.query.sortBy] = req.query.sortOrder === 'asc' ? 1 : -1;
        } else {
            sort[req.query.sortBy] = req.query.sortOrder === 'asc' ? 1 : -1;
            sort['date_added'] = 1;
        }
        const result = await collection.find(query).sort(sort).toArray();
        console.log(result.length);
        res.send(result);
    }
    else {
        const result = await collection.find(query).toArray();
        console.log(result.length);
        res.send(result);
    }
});



app.get('/reset', async (req, res) => {

    const client = await connect();

    const db = client.db('netflix');
    const collection = db.collection('shows');

    try {
        const count = await collection.countDocuments();

        if (count > 0) {
            const result = await collection.deleteMany({});
            res.send("Database reset successfull");
        } else {
            res.send("Database is already empty");
        }
    } catch (err) {
        res.status(500).send("Internal server error");
    }
});

app.get('/seed', async (req, res) => {

    const client = await connect();

    const db = client.db('netflix');
    const collection = db.collection('shows');

    try {
        var status = await seed();
        if (status == true) {
            res.send("Database seeded successfully");
        } else {

            res.send("Database is already seeded");
        }
    } catch (err) {
        res.status(500).send("Internal server error");
    }
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});



