const express = require('express');
const router = express.Router();
const Sensor = require('../models/sensor');

// Retrieves sensor entries from database and responds with summary report of readings
router.get('/sensordatasummary',function(req,res,next){
    Sensor.find(req.body).then(function(sensordata){
        const validPollutantData = sensordata.filter(sensor => Boolean(sensor.pollutant))
                                          .flatMap((value, key)=>{return value.pollutant;});
        const pollutantReadings = constructPollutantReadingsMap(validPollutantData);
        const summary = {};
        for (const key in pollutantReadings) {
            const sum = pollutantReadings[key].reduce((a,b) => a+b, 0);
            var average = sum !=0 ? sum/pollutantReadings[key].length : 0;
            summary[key]={min: pollutantReadings[key].length == 0 ? 0 : Math.min(...pollutantReadings[key]), 
                          max: pollutantReadings[key].length == 0 ? 0 : Math.max(...pollutantReadings[key]), 
                          average: average};;
        }
        res.send(summary);
    }).catch(next);
});

function constructPollutantReadingsMap(data) {
    let result = {};
    for (let row of data) {
      for (let [key, value] of Object.entries(row)) {
        result[key] = result[key] || [];
        if(value) //to eliminate all undefined readings from being added to list
            result[key].push(value); 
      }
    }
    return result;
}

//Currently available for manual testing which responds with all entries in database
router.get('/sensordata',function(req,res,next){
    Sensor.find(req.body).then(function(sensordata){
        res.send(sensordata);
    }).catch(next);
});

// Adds sensor data to database
router.post('/sensordata',function(req,res,next){
    Sensor.create(req.body).then(function(sensor){
        res.send(sensor);
    }).catch(next);
});

module.exports = router;