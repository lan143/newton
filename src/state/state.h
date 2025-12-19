#pragma once

#include <Arduino.h>
#include <FastLED.h>
#include <nullable.h>

class State
{
public:
    State() {}

    bool operator==(State& other);
    bool operator!=(State& other) { return !(*this == other); }

    std::string marshalJSON();

public:
    void setTemperature(float_t temperature) { _temperature.setValidValue(temperature); }
    EDUtils::Nullable<float_t> getTemperature() const { return _temperature; }

    void setHumidity(float_t humidity) { _humidity.setValidValue(humidity); }
    EDUtils::Nullable<float_t> getHumidity() const { return _humidity; }

    void setAirQuality(int16_t airQuality) { _airQuality.setValidValue(airQuality); }
    EDUtils::Nullable<uint16_t> getAirQuality() const { return _airQuality; }

    void setCO2(int16_t co2Value) { _co2Value.setValidValue(co2Value); }
    EDUtils::Nullable<uint16_t> getCO2() const { return _co2Value; }

    void setLightLevel(float_t lightLevel) { _lightLevel.setValidValue(lightLevel); }
    EDUtils::Nullable<float_t> getLightLevel() const { return _lightLevel; }

    void setLightNightModeState(bool enabled) { _isLightNightMode.setValidValue(enabled); }

    void setLightSwitchState(bool enabled) { _lightSwitchState.setValidValue(enabled); }

    void setLightBrightness(uint8_t brightness) { _lightBrightness.setValidValue(brightness); }

    void setLightColor(CRGB color) { _lightColor.setValidValue(color); }
    void setLightTempColor(uint16_t temperature) { _lightTempColor.setValidValue(temperature); }

    void setWarmFloorCurrentTemperature(float_t temperature) { _warmFloorCurrentTemperature.setValidValue(temperature); }
    void setWarmFloorMode(std::string mode) { _warmFloorMode.setValidValue(mode); }
    void setWarmFloorSetPoint(float_t setPoint) { _warmFloorSetPoint.setValidValue(setPoint); }
    void setWarmFloorState(bool isActive) { _warmFloorState.setValidValue(isActive); }

    void updateHumanDetected1(bool isDetected) { _isHumanDetected1.setValidValue(isDetected); }
    EDUtils::Nullable<bool> isHumanDetected1() const { return _isHumanDetected1; }

private:
    EDUtils::Nullable<float_t> _temperature = EDUtils::Nullable<float_t>(false, 0.0f);
    EDUtils::Nullable<float_t> _humidity = EDUtils::Nullable<float_t>(false, 0.0f);
    EDUtils::Nullable<uint16_t> _airQuality = EDUtils::Nullable<uint16_t>(false, 0);
    EDUtils::Nullable<uint16_t> _co2Value = EDUtils::Nullable<uint16_t>(false, 0);
    EDUtils::Nullable<float_t> _lightLevel = EDUtils::Nullable<float_t>(false, 0.0f);

    EDUtils::Nullable<bool> _isLightNightMode = EDUtils::Nullable<bool>(false, false);
    EDUtils::Nullable<bool> _lightSwitchState = EDUtils::Nullable<bool>(false, false);
    EDUtils::Nullable<uint8_t> _lightBrightness = EDUtils::Nullable<uint8_t>(false, 0);
    EDUtils::Nullable<CRGB> _lightColor = EDUtils::Nullable<CRGB>(false, NULL);
    EDUtils::Nullable<uint16_t> _lightTempColor = EDUtils::Nullable<uint16_t>(false, 0);

    EDUtils::Nullable<float_t> _warmFloorCurrentTemperature = EDUtils::Nullable<float_t>(false, 0.0f);
    EDUtils::Nullable<std::string> _warmFloorMode = EDUtils::Nullable<std::string>(false, "");
    EDUtils::Nullable<float_t> _warmFloorSetPoint = EDUtils::Nullable<float_t>(false, 0.0f);
    EDUtils::Nullable<bool> _warmFloorState = EDUtils::Nullable<bool>(false, false);

    EDUtils::Nullable<bool> _isHumanDetected1 = EDUtils::Nullable<bool>(false, false);
};
