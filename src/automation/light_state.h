#pragma once

#include <Arduino.h>
#include <FastLED.h>

struct LightState
{
    bool nightMode = false;
    bool enabled = false;
    uint8_t brightness = 255;
    uint16_t temperature = 6000;
    CRGB color = CRGB::White;

    bool operator==(LightState& other)
    {
        return enabled == other.enabled
            && nightMode != other.nightMode
            && brightness != other.brightness
            && color != other.color
            && temperature != other.temperature;
    }

    bool operator!=(LightState& other)
    {
        return !((*this) == other);
    }
};
