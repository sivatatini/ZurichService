const request = require('supertest');
const mockingoose = require('mockingoose');
const Sensor = require('../models/sensor');
const app = require('../index');

describe('apis service', () => {

  describe('sensordatasummary get endpoint', () => {
    test('should return summary', async () => {
      mockingoose(Sensor).toReturn([
        {
          "sensorid": "testID1",
          "timestamp": "2023-07-09T04:10:00.000Z",
          "pollutant": {
            "o3": 0.5,
            "co": 50,
            "so2": 1000,
            "no2": 2000
          }
        },
        {
          "sensorid": "testID2",
          "timestamp": "2023-07-09T04:10:00.000Z",
          "pollutant": {
            "o3": 0.2,
            "co": 20,
            "so2": 500,
            "no2": 1000
          }
        }
      ], 'find');
      
      const res = await request(app).get('/sensordatasummary');
        
      expect(res.statusCode).toEqual(200);
      expect(res.body.o3).toBeDefined();
      expect(res.body.o3.min).toEqual(0.2);
      expect(res.body.o3.max).toEqual(0.5);
      expect(res.body.o3.average).toEqual(0.35);

      expect(res.body.co).toBeDefined();
      expect(res.body.co.min).toEqual(20);
      expect(res.body.co.max).toEqual(50);
      expect(res.body.co.average).toEqual(35);

      expect(res.body.so2).toBeDefined();
      expect(res.body.so2.min).toEqual(500);
      expect(res.body.so2.max).toEqual(1000);
      expect(res.body.so2.average).toEqual(750);

      expect(res.body.no2).toBeDefined();
      expect(res.body.no2.min).toEqual(1000);
      expect(res.body.no2.max).toEqual(2000);
      expect(res.body.no2.average).toEqual(1500);
    })

    test('should remove invalid data when calculating summary', async () => {
      mockingoose(Sensor).toReturn([
        {
          "sensorid": "testID1",
          "timestamp": "2023-07-09T04:10:00.000Z",
          "pollutant": {
            "o3": 0.5,
            "co": 50,
            "so2": 1000,
            "no2": 2000
          }
        },
        {
          "sensorid": "testID2",
          "timestamp": "2023-07-09T04:10:00.000Z",
          "pollutant": {
          }
        },
        {
          "sensorid": "testID3",
          "timestamp": "2023-07-09T04:10:00.000Z"
        }
      ], 'find');
        
      const res = await request(app).get('/sensordatasummary');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.o3).toBeDefined();
      expect(res.body.o3.min).toEqual(0.5);
      expect(res.body.o3.max).toEqual(0.5);
      expect(res.body.o3.average).toEqual(0.5);

      expect(res.body.co).toBeDefined();
      expect(res.body.co.min).toEqual(50);
      expect(res.body.co.max).toEqual(50);
      expect(res.body.co.average).toEqual(50);

      expect(res.body.so2).toBeDefined();
      expect(res.body.so2.min).toEqual(1000);
      expect(res.body.so2.max).toEqual(1000);
      expect(res.body.so2.average).toEqual(1000);

      expect(res.body.no2).toBeDefined();
      expect(res.body.no2.min).toEqual(2000);
      expect(res.body.no2.max).toEqual(2000);
      expect(res.body.no2.average).toEqual(2000);
    })
    
    test('can accommodate data with missed readings while calculating summary', async () => {
      mockingoose(Sensor).toReturn([
        {
          "sensorid": "testID1",
          "timestamp": "2023-07-09T04:10:00.000Z",
          "pollutant": {
            "o3": 0.5
          }
        },
        {
          "sensorid": "testID2",
          "timestamp": "2023-07-09T04:10:00.000Z",
          "pollutant": {
            "co": 50
          }
        },
        {
          "sensorid": "testID3",
          "timestamp": "2023-07-09T04:10:00.000Z",
          "pollutant": {
            "so2": 1000
          }
        },
        {
          "sensorid": "testID3",
          "timestamp": "2023-07-09T04:10:00.000Z",
          "pollutant": {
            "no2": 2000
          }
        }
      ], 'find');
        
      const res = await request(app).get('/sensordatasummary');
    
      expect(res.statusCode).toEqual(200);
      expect(res.body.o3).toBeDefined();
      expect(res.body.o3.min).toEqual(0.5);
      expect(res.body.o3.max).toEqual(0.5);
      expect(res.body.o3.average).toEqual(0.5);

      expect(res.body.co).toBeDefined();
      expect(res.body.co.min).toEqual(50);
      expect(res.body.co.max).toEqual(50);
      expect(res.body.co.average).toEqual(50);

      expect(res.body.so2).toBeDefined();
      expect(res.body.so2.min).toEqual(1000);
      expect(res.body.so2.max).toEqual(1000);
      expect(res.body.so2.average).toEqual(1000);

      expect(res.body.no2).toBeDefined();
      expect(res.body.no2.min).toEqual(2000);
      expect(res.body.no2.max).toEqual(2000);
      expect(res.body.no2.average).toEqual(2000);
    })

    test('zero readings doesnt throw exception while calculating summary', async () => {
      mockingoose(Sensor).toReturn([
        {
          "sensorid": "testID1",
          "timestamp": "2023-07-09T04:10:00.000Z",
          "pollutant": {
            "o3": 0,
            "co": 0,
            "so2": 0,
            "no2": 0
          }
        }
      ], 'find');
        
      const res = await request(app).get('/sensordatasummary');
    
      expect(res.statusCode).toEqual(200);
      expect(res.body.o3).toBeDefined();
      expect(res.body.o3.min).toEqual(0);
      expect(res.body.o3.max).toEqual(0);
      expect(res.body.o3.average).toEqual(0);

      expect(res.body.co).toBeDefined();
      expect(res.body.co.min).toEqual(0);
      expect(res.body.co.max).toEqual(0);
      expect(res.body.co.average).toEqual(0);

      expect(res.body.so2).toBeDefined();
      expect(res.body.so2.min).toEqual(0);
      expect(res.body.so2.max).toEqual(0);
      expect(res.body.so2.average).toEqual(0);

      expect(res.body.no2).toBeDefined();
      expect(res.body.no2.min).toEqual(0);
      expect(res.body.no2.max).toEqual(0);
      expect(res.body.no2.average).toEqual(0);
    })
  })

  describe('sensordata post endpoint', () => {
    test('should add new sensor data', async () => {
      mockingoose(Sensor).toReturn(
        {
          "sensorid": "testID1",
          "timestamp": "2023-07-09T04:10:00.000Z",
          "pollutant": {
            "o3": 0.5,
            "co": 50,
            "so2": 1000,
            "no2": 2000
          }
        }, 'create');
      const res = await request(app).post('/sensordata');
      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toBeDefined();
    })
  })
});