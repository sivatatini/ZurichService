# ZurichService

Named after the cleanest city of the world in terms of air quality, this service currently collects pollutant data from an array of sensors, stores them in MongoDb database and retrieves pollutant summary either specific to a particular sensor or an aggregated report with data collected from entire collection of the sensors that reports to this service.

## Install

### Setup package
    npm install
    
### MongoDB
    brew tap mongodb/brew
    brew update
    brew install mongodb-community@6.0

### Mongoose
    npm install mongoose --save

## Run the tests

    npm i mockingoose -D
    npm i mongoose crypto jest mongodb-memory-server
    npm install -- save-dev jest
    npm install --save-dev jest supertest
    npm run test

## Run the app

    brew services start mongodb-community@6.0
    npm run start

## Stop MongoDb

    brew services stop mongodb-community@6.0

## Sample Debug API that might help

    There is a get sensordata API that will return the database entries if manual testing or validation is needed.

## Sample Request Responses
**Sample Post sensordata Request Structure: localhost:4000/sensordata**
```
{
    "sensorid": "Sensor1001",
    "timestamp": "2023-07-10T04:10:00.000Z",
    "pollutant": {
        "o3": 0.1,
        "co": 18,
        "so2": 322,
        "no2": 750
    }
}
```
**Sample Post Response**
```
{
    "sensorid": "Sensor1001",
    "timestamp": "2023-07-10T04:10:00.000Z",
    "pollutant": {
        "o3": 0.1,
        "co": 18,
        "so2": 322,
        "no2": 750
    },
    "_id": "64a9dbe921d7167aefd9a69e",
    "__v": 0
}
```
**Sample Get sensordatasummary Response: localhost:4000/sensordatasummary**
```
{
    "o3": {
        "min": 0.1,
        "max": 0.5,
        "average": 0.24999999999999997
    },
    "co": {
        "min": 18,
        "max": 50,
        "average": 32
    },
    "so2": {
        "min": 322,
        "max": 1000,
        "average": 580.5
    },
    "no2": {
        "min": 750,
        "max": 2000,
        "average": 1187.5
    }
}
```

**Sample Get sensordatasummary Request with optional Id in the body: localhost:4000/sensordatasummary**
```
{
    "sensorid": "Sensor1001"
}
```
Response to the above request will be similar to the one above but the result is calculated by only considering the readings from provided sensorid

![alt text](https://ibb.co/ckTGNSH)
![alt text](https://ibb.co/6N16cL6)
![alt text](https://ibb.co/QCDL8Kv)

## References:

* https://expressjs.com/en/starter/hello-world.html
* https://towardsdatascience.com/build-a-rest-api-with-node-express-and-mongodb-937ff95f23a5
* https://dev.to/darkmavis1980/how-to-test-mongoose-models-with-jest-and-mockingoose-2k10