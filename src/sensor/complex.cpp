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
        ->setDeviceClass(EDHA::deviceClassSensorAQI);

    _mswSensor->enableCO2Sensor(true);
}

void ComplexSensor::loop()
{
    if ((_lastClimateUpdateTime + 10000) < millis()) {
        float_t temperature = _mswSensor->getTemperature();
        if (temperature > -40.0f && temperature < 80.0f) {
            _stateMgr->setTemperature(_mswSensor->getTemperature());
        }

        float_t humidity = _mswSensor->getHumidity();
        if (humidity > 0.0f) {
            _stateMgr->setHumidity(_mswSensor->getHumidity());
        }

        _lastClimateUpdateTime = millis();
    }

    if ((_lastAirQualityUpdateTime + 1000) < millis()) {
        int16_t airQualityRaw = _mswSensor->getAirQuality();
        if (airQualityRaw != 0) {
            int16_t airQualiy = _airQualityFilter->filtered(airQualityRaw);
            _stateMgr->setAirQuality(airQualiy);
        }

        _lastAirQualityUpdateTime = millis();
    }

    if ((_lastCO2UpdateTime + 1000) < millis()) {
        int16_t co2Value = _mswSensor->getCO2Value();
        if (co2Value > 0) {
            _stateMgr->setCO2(co2Value);
        }

        _lastCO2UpdateTime = millis();
    }
}
