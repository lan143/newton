#pragma once

#include <FastLED.h>
#include "state.h"
#include "producer.h"

class StateMgr
{
public:
    StateMgr(StateProducer* producer) : _producer(producer) {}
    void loop();

    const State& getCurrentState() const { return _currentState; }

    void setTemperature(float_t temperature)
    {
        if (temperature != -1000.0f && (abs(temperature - _currentState.getTemperature()) > 0.1 || (_updateTemperatureLastTime + 1200000) < millis())) {
            _currentState.setTemperature(temperature);
            _updateTemperatureLastTime = millis();
        }
    }

    void setHumidity(float_t humidity)
    {
        if (humidity > 0.0f && (abs(humidity - _currentState.getHumidity()) > 0.5 || (_updateHumidityLastTime + 1200000) < millis())) {
            _currentState.setHumidity(humidity);
            _updateHumidityLastTime = millis();
        }
    }

    void setAirQuality(int16_t airQuality)
    {
        if (airQuality > 0 && (abs(airQuality - _currentState.getAirQuality()) > 50 || (_updateAirQualityLastTime + 300000) < millis())) {
            _currentState.setAirQuality(airQuality);
            _updateAirQualityLastTime = millis();
        }
    }

    void setCO2(int16_t co2Value)
    {
        if (co2Value > 0 && (abs(co2Value - _currentState.getCO2()) > 50 || (_updateCO2LastTime + 300000) < millis())) {
            _currentState.setCO2(co2Value);
            _updateCO2LastTime = millis();
        }
    }

    void setLightLevel(float_t lightLevel) { _currentState.setLightLevel(lightLevel); }

    void setLightNightModeState(bool enabled) { _currentState.setLightNightModeState(enabled); }
    void setLightSwitchState(bool enabled) { _currentState.setLightSwitchState(enabled); }
    void setLightBrightness(uint8_t brightness) { _currentState.setLightBrightness(brightness); }
    void setLightColor(CRGB color) { _currentState.setLightColor(color); }
    void setLightTempColor(uint16_t temp) {_currentState.setLightTempColor(temp); }

    void setWarmFloorCurrentTemperature(float_t temperature) { _currentState.setWarmFloorCurrentTemperature(temperature); }
    void setWarmFloorMode(std::string mode) { _currentState.setWarmFloorMode(mode); }
    void setWarmFloorSetPoint(float_t setPoint) { _currentState.setWarmFloorSetPoint(setPoint); }
    void setWarmFloorState(bool isActive) { _currentState.setWarmFloorState(isActive); }

private:
    State _currentState;
    State _prevState;
    StateProducer* _producer;
    unsigned long _updateStateLastTime = 0;
    unsigned long _updateTemperatureLastTime = 0;
    unsigned long _updateHumidityLastTime = 0;
    unsigned long _updateAirQualityLastTime = 0;
    unsigned long _updateCO2LastTime = 0;
};
