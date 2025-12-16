#pragma once

#include <Arduino.h>

enum ThermostatMode : uint8_t
{
    THERMOSTAT_MODE_OFF = 0,
    THERMOSTAT_MODE_HEAT = 1
};

struct ThermostatState
{
    ThermostatMode mode = THERMOSTAT_MODE_OFF;
    float_t setPoint = 20.0f;
    bool isActive = false;
};
