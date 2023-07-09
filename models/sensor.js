const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Sensor schema & model
const SensorSchema = new Schema({
    sensorid: {
        type: String,
        required: [true, 'Sensor ID is required']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    pollutant:{
        o3: {
            type: Number,
            min: [0, 'Ground-level ozone (O3) should not be less than 0'],
            max: [0.604, 'Ground-level ozone (O3) cannot be more than 0.604']
        },
        co: {
            type: Number,
            min: [0, 'Carbon monoxide (CO) should not be less than 0'],
            max: [50.4, 'Carbon monoxide (CO) cannot be more than 50.4']
        },
        so2: {
            type: Number,
            min: [0, 'Sulfur dioxide (SO2) should not be less than 0'],
            max: [1004, 'Sulfur dioxide (SO2) cannot be more than 1004']
        },
        no2: {
            type: Number,
            min: [0, 'Nitrogen dioxide (NO2) should not be less than 0'],
            max: [2049, 'Nitrogen dioxide (NO2) cannot be more than 2049']
        },
    }
});


const Sensor = mongoose.model('sensor',SensorSchema);

module.exports = Sensor;