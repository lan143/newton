#include <Utils.h>
#include "sensor/complex.h"

void ComplexSensor::init(EDHA::Device* device, std::string stateTopic, uint8_t address)
{
    const char* chipID = EDUtils::getChipID();
    _mswSensor = _modbus->addMSW(address);

    _discoveryMgr->addSensor(
        device,
        "Temperature",
        "temperature",
        EDUtils::formatString("temperature_newton_%s", chipID)
    )
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.temperature }}")
        ->setUnitOfMeasurement("°C")
        ->setDeviceClass(EDHA::deviceClassSensorTemperature);

    _discoveryMgr->addSensor(
        device,
        "Humidity",
        "humidity",
        EDUtils::formatString("humidity_newton_%s", chipID)
    )
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.humidity }}")
        ->setUnitOfMeasurement("%")
        ->setDeviceClass(EDHA::deviceClassSensorHumidity);

    _discoveryMgr->addSensor(
        device,
        "Air quality",
        "airQuality",
        EDUtils::formatString("air_quality_newton_%s", chipID)
    )
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.airQuality }}")
        ->setUnitOfMeasurement("ppb")
        ->setDeviceClass(EDHA::deviceClassSensorAQI);

    _discoveryMgr->addSensor(
        device,
        "CO2",
        "co2",
        EDUtils::formatString("co2_newton_%s", chipID)
    )
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.co2 }}")
        ->setUnitOfMeasurement("ppm")
        ->setDeviceClass("carbon_dioxide");

    _discoveryMgr->addSensor(
        device,
        "Light level",
        "lightLevel",
        EDUtils::formatString("light_level_newton_%s", chipID)
    )
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.lightLevel }}")
        ->setUnitOfMeasurement("lx")
        ->setDeviceClass("illuminance");

    _mswSensor->enableCO2Sensor(true);
}

void ComplexSensor::loop()
{
    if ((_lastClimateUpdateTime + 10000) < millis()) {
        auto temperature = _mswSensor->getTemperature();
        if (temperature._success) {
            _stateMgr->getState().setTemperature(temperature._value);
        }

        auto humidity = _mswSensor->getHumidity();
        if (humidity._success) {
            _stateMgr->getState().setHumidity(humidity._value);
        }

        _lastClimateUpdateTime = millis();
    }

    if ((_lastAirQualityUpdateTime + 1000) < millis()) {
        auto airQualityRaw = _mswSensor->getAirQuality();
        if (airQualityRaw._success) {
            int16_t airQualiy = _airQualityFilter->filtered(airQualityRaw._value);
            _stateMgr->getState().setAirQuality(airQualiy);
        }

        _lastAirQualityUpdateTime = millis();
    }

    if ((_lastCO2UpdateTime + 1000) < millis()) {
        auto co2Value = _mswSensor->getCO2Value();
        if (co2Value._success) {
            _stateMgr->getState().setCO2(co2Value._value);
        }

        _lastCO2UpdateTime = millis();
    }

    if ((_lastLightLevelUpdateTime + 10000) < millis()) {
        auto level = _mswSensor->getLightLevel();
        if (level._success) {
            _stateMgr->getState().setLightLevel(level._value);
        }

        _lastLightLevelUpdateTime = millis();
    }
}
