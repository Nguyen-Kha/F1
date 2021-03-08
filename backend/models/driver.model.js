const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResultsSchema = new Schema({
    race: { type: String, required: true },
    place: { type: String },
    fastestLap: { type: Boolean },
    points: { type: Number },
    status: { type: String },
    reason: { type: String }
});

const DriverSchema = new Schema({
    year: { type: Number, required: true },
    name: { type: String, required: true },
    totalPoints: { type: Number, required: true },
    extraTotalPoints: { type: Number },
    results: { type: [ResultsSchema] }
}/*, {
    timestamps: true,
}*/, {
    collection: 'Drivers'
});

// Use with 'Drivers' Collection
module.exports = mongoose.model('Driver', DriverSchema, 'Drivers');