#pragma once

#include <Arduino.h>
#include <FastLED.h>
#include <enum/modes.h>

class Command
{
public:
    bool unmarshalJSON(const char* data);

    bool hasLightNightMode() const { return _hasLightNightMode; }
    bool isLightNightMode() { return _isLightNightMode; }

    bool hasLightBrightness() const { return _hasLightBrightness; }
    uint8_t getLightBightness() const { return _lightBrightness; }

    bool hasLightColor() const { return _hasLightColor; }
    CRGB getLightColor() const { return _lightColor; }

    bool hasLightTempColor() const { return _hasLightTempColor; }
    uint16_t getLightTempColor() const { return _lightTempColor; }

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
    bool _hasLightNightMode = false;
    bool _isLightNightMode = false;

    bool _hasLightBrightness = false;
    uint8_t _lightBrightness = 0;

    bool _hasLightColor = false;
    CRGB _lightColor = 0;

    bool _hasLightTempColor = false;
    uint16_t _lightTempColor = 0;

    bool _hasWarmFloorMode = false;
    std::string _warmFloorMode = "";

    bool _hasWarmFloorSetPoint = false;
    float_t _warmFloorSetPoint = 0.0f;
};
