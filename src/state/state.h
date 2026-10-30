#pragma once

#include <Arduino.h>
#include <nullable.h>

class State
{
public:
    State() {}

    bool operator==(State& other);
    bool operator!=(State& other) { return !(*this == other); }

    std::string marshalJSON();

public:
    void setWarmFloorCurrentTemperature(float_t temperature) { _warmFloorCurrentTemperature.setValidValue(temperature); }
    void setWarmFloorMode(std::string mode) { _warmFloorMode.setValidValue(mode); }
    void setWarmFloorSetPoint(float_t setPoint) { _warmFloorSetPoint.setValidValue(setPoint); }
    void setWarmFloorState(bool isActive) { _warmFloorState.setValidValue(isActive); }

    const EDUtils::Nullable<float_t>& warmFloorCurrentTemperature() const { return _warmFloorCurrentTemperature; }
    const EDUtils::Nullable<bool>& warmFloorState() const { return _warmFloorState; }

private:
    EDUtils::Nullable<float_t> _warmFloorCurrentTemperature = EDUtils::Nullable<float_t>(false, 0.0f);
    EDUtils::Nullable<std::string> _warmFloorMode = EDUtils::Nullable<std::string>(false, "");
    EDUtils::Nullable<float_t> _warmFloorSetPoint = EDUtils::Nullable<float_t>(false, 0.0f);
    EDUtils::Nullable<bool> _warmFloorState = EDUtils::Nullable<bool>(false, false);
};
