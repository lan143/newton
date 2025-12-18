#pragma once

#include <Arduino.h>
#include <FastLED.h>

class State
{
public:
    State() {}

    bool operator==(State& other);
    bool operator!=(State& other) { return !(*this == other); }

    std::string marshalJSON();

public:
    void setTemperature(float_t temperature) { _temperature = temperature; }
    float_t getTemperature() const { return _temperature; }

    void setHumidity(float_t humidity) { _humidity = humidity; }
    float_t getHumidity() const { return _humidity; }

    void setAirQuality(int16_t airQuality) { _airQuality = airQuality; }
    int16_t getAirQuality() const { return _airQuality; }

    void setCO2(int16_t co2Value) { _co2Value = co2Value; }
    int16_t getCO2() const { return _co2Value; }

    void setLightLevel(float_t lightLevel) { _lightLevel = lightLevel; }

    void setLightNightModeState(bool enabled) { _isLightNightMode = enabled; }
    void setLightSwitchState(bool enabled) { _lightSwitchState = enabled; }
    void setLightBrightness(uint8_t brightness) { _lightBrightness = brightness; }
    void setLightColor(CRGB color) { _lightColor = color; }
    void setLightTempColor(uint16_t temperature) { _lightTempColor = temperature; }

    void setWarmFloorCurrentTemperature(float_t temperature) { _warmFloorCurrentTemperature = temperature; }
    void setWarmFloorMode(std::string mode) { _warmFloorMode = mode; }
    void setWarmFloorSetPoint(float_t setPoint) { _warmFloorSetPoint = setPoint; }
    void setWarmFloorState(bool isActive) { _warmFloorState = isActive; }

    void updateHumanDetected1(bool isDetected) { _isHumanDetected1 = isDetected; }

private:
    float_t _temperature = -1000.0f;
    float_t _humidity = -1000.0f;
    int16_t _airQuality = -1;
    int16_t _co2Value = -1;
    float_t _lightLevel = -1.0f;

    bool _isLightNightMode = false;
    bool _lightSwitchState = false;
    uint8_t _lightBrightness = 0;
    CRGB _lightColor;
    uint16_t _lightTempColor = 0;

    float_t _warmFloorCurrentTemperature = -1000.0f;
    std::string _warmFloorMode = "";
    float_t _warmFloorSetPoint = -1000.0f;
    bool _warmFloorState = false;

    bool _isHumanDetected1 = false;
};
