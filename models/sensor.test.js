const mongoose = require("mongoose");
const  Sensor  = require("./sensor");
const db = require("../setup/testdb");

const sensorDataWithoutID = {
  
}

const sensorDataWithID = {
  sensorid: "testID"
};

const sensorDataWithIDAndInvalidTimeStamp = {
  sensorid:"testID",
  timestamp: "Invalid Time"
}

const sensorDataWithIDAndTimeStamp = {
    sensorid:"testID",
    timestamp: "7/6/2023"
}

const sensorDataWithO3LessThanZero = {
    sensorid:"testID",
    pollutant:{
      o3:-1
    }
}

const sensorDataWithCOLessThanZero = {
  sensorid:"testID",
  pollutant:{
    co:-1
  }
}

const sensorDataWithSO2LessThanZero = {
  sensorid:"testID",
  pollutant:{
    so2:-1
  }
}

const sensorDataWithNO2LessThanZero = {
  sensorid:"testID",
  pollutant:{
    no2:-1
  }
}

const sensorDataWithO3GreaterThanMax = {
  sensorid:"testID",
  pollutant:{
    o3:0.7
  }
}

const sensorDataWithCOGreaterThanMax = {
  sensorid:"testID",
  pollutant:{
    co:51
  }
}

const sensorDataWithSO2GreaterThanMax = {
  sensorid:"testID",
  pollutant:{
    so2:1005
  }
}

const sensorDataWithNO2GreaterThanMax = {
  sensorid:"testID",
  pollutant:{
    no2:2050
  }
}

const sensorDataWithAllValidReadings = {
  sensorid:"testID8",
  timestamp: "7/6/2023",
  pollutant:{
    o3:0.6,
    co:50,
    so2:1003,
    no2:2048
  }
}

beforeAll(async () => {
  await db.setUp();
}, 10000);

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});


/**
 * User model
 */
describe("Sensor model", () => {
    it("throws error when ID not provided", async () => {
      const invalidSensorData = new Sensor(sensorDataWithoutID)
      await expect(invalidSensorData.validate()).rejects.toThrow('sensor validation failed: sensorid: Sensor ID is required')
    });

    it("stores data when ID is provided", async () => {
      const validSensorData = new Sensor(sensorDataWithID);
      const savedSensorData = await validSensorData.save();
      expect(savedSensorData.sensorid).toBeDefined();
      expect(savedSensorData._id).toBeDefined();
      expect(savedSensorData.sensorid).toBe(sensorDataWithID.sensorid);
    });

    it("throws error when timestamp is not in Date format", async () => {
      const invalidSensorData = new Sensor(sensorDataWithIDAndInvalidTimeStamp)
      await expect(invalidSensorData.validate()).rejects.toThrow('sensor validation failed: timestamp: Cast to date failed for value \"Invalid Time\" (type string) at path \"timestamp\"');
    });
    
    it("stores data when ID and timestamp are provided", async () => {
      const validSensorData = new Sensor(sensorDataWithIDAndTimeStamp);
      const savedSensorData = await validSensorData.save();
      expect(savedSensorData.sensorid).toBeDefined();
      expect(savedSensorData._id).toBeDefined();
      expect(savedSensorData.sensorid).toBe(sensorDataWithID.sensorid);
      expect(savedSensorData.timestamp).toBeDefined();
    });

    it("throws error when O3 less than zero", async () => {
      const invalidSensorData = new Sensor(sensorDataWithO3LessThanZero)
      await expect(invalidSensorData.validate()).rejects.toThrow('sensor validation failed: pollutant.o3: Ground-level ozone (O3) should not be less than 0')
    });

    it("throws error when O3 greater than 0.604", async () => {
      const invalidSensorData = new Sensor(sensorDataWithO3GreaterThanMax)
      await expect(invalidSensorData.validate()).rejects.toThrow('sensor validation failed: pollutant.o3: Ground-level ozone (O3) cannot be more than 0.604')
    });

    it("throws error when CO less than zero", async () => {
      const invalidSensorData = new Sensor(sensorDataWithCOLessThanZero)
      await expect(invalidSensorData.validate()).rejects.toThrow('sensor validation failed: pollutant.co: Carbon monoxide (CO) should not be less than 0')
    });

    it("throws error when CO greater than 50.4", async () => {
      const invalidSensorData = new Sensor(sensorDataWithCOGreaterThanMax)
      await expect(invalidSensorData.validate()).rejects.toThrow('sensor validation failed: pollutant.co: Carbon monoxide (CO) cannot be more than 50.4')
    });

    it("throws error when SO2 less than zero", async () => {
      const invalidSensorData = new Sensor(sensorDataWithSO2LessThanZero)
      await expect(invalidSensorData.validate()).rejects.toThrow('sensor validation failed: pollutant.so2: Sulfur dioxide (SO2) should not be less than 0')
    });

    it("throws error when SO2 greater than 1004", async () => {
      const invalidSensorData = new Sensor(sensorDataWithSO2GreaterThanMax)
      await expect(invalidSensorData.validate()).rejects.toThrow('sensor validation failed: pollutant.so2: Sulfur dioxide (SO2) cannot be more than 1004')
    });

    it("throws error when NO2 less than zero", async () => {
      const invalidSensorData = new Sensor(sensorDataWithNO2LessThanZero)
      await expect(invalidSensorData.validate()).rejects.toThrow('sensor validation failed: pollutant.no2: Nitrogen dioxide (NO2) should not be less than 0')
    });

    it("throws error when NO2 greater than 2049", async () => {
      const invalidSensorData = new Sensor(sensorDataWithNO2GreaterThanMax)
      await expect(invalidSensorData.validate()).rejects.toThrow('sensor validation failed: pollutant.no2: Nitrogen dioxide (NO2) cannot be more than 2049')
    });
    
    it("stores data when all valid readings are provided", async () => {
      const validSensorData = new Sensor(sensorDataWithAllValidReadings);
      const savedSensorData = await validSensorData.save();
      expect(savedSensorData.id).toBeDefined();
      expect(savedSensorData._id).toBeDefined();
      expect(savedSensorData.sensorid).toBe(sensorDataWithAllValidReadings.sensorid);
      expect(savedSensorData.timestamp).toBeDefined();
      expect(savedSensorData.o3).toBe(sensorDataWithAllValidReadings.o3);
      expect(savedSensorData.co).toBe(sensorDataWithAllValidReadings.co);
      expect(savedSensorData.no2).toBe(sensorDataWithAllValidReadings.no2);
      expect(savedSensorData.so2).toBe(sensorDataWithAllValidReadings.so2);
    });

});