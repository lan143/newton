#pragma once

#include <Arduino.h>
#include <enum/modes.h>

class Command
{
public:
    bool unmarshalJSON(const char* data);

    bool hasWarmFloorMode() const { return _hasWarmFloorMode; }
    EDHA::Mode getWarmFloorMode() const
    {
        if (_warmFloorMode == "off") {
            return EDHA::MODE_OFF;
        } else if (_warmFloorMode == "heat") {
            return EDHA::MODE_HEAT;
        }

        return EDHA::MODE_OFF;
    }

    bool hasWarmFloorSetPoint() const { return _hasWarmFloorSetPoint; }
    float_t getWarmFloorSetPoint() const { return _warmFloorSetPoint; }

private:
    bool _hasWarmFloorMode = false;
    std::string _warmFloorMode = "";

    bool _hasWarmFloorSetPoint = false;
    float_t _warmFloorSetPoint = 0.0f;
};
