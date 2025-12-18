#include <Json.h>
#include <ExtStrings.h>
#include "defines.h"
#include "state.h"

bool State::operator==(State& other)
{
    return (*this)._temperature == other._temperature
        && (*this)._humidity == other._humidity
        && (*this)._airQuality == other._airQuality
        && (*this)._co2Value == other._co2Value
        && (*this)._lightLevel == other._lightLevel
        && (*this)._isLightNightMode == other._isLightNightMode
        && (*this)._lightSwitchState == other._lightSwitchState
        && (*this)._lightBrightness == other._lightBrightness
        && (*this)._lightColor == other._lightColor
        && (*this)._lightTempColor == other._lightTempColor
        && (*this)._warmFloorCurrentTemperature == other._warmFloorCurrentTemperature
        && (*this)._warmFloorMode == other._warmFloorMode
        && (*this)._warmFloorSetPoint == other._warmFloorSetPoint
        && (*this)._warmFloorState == other._warmFloorState;
}

std::string State::marshalJSON()
{
    std::string payload = EDUtils::buildJson([this](JsonObject entity) {
        if (_temperature != -1000.0f) {
            entity[F("temperature")] = _temperature;
        }

        if (_humidity != -1000.0f) {
            entity[F("humidity")] = _humidity;
        }

        if (_airQuality != -1) {
            entity[F("airQuality")] = _airQuality;
        }

        if (_co2Value != -1) {
            entity[F("co2")] = _co2Value;
        }

        if (_lightLevel != -1.0f) {
            entity[F("lightLevel")] = _lightLevel;
        }

        entity[F("lightNightMode")] = _isLightNightMode ? "true" : "false";
        entity[F("lightSwitchState")] = _lightSwitchState ? "ON" : "OFF";
        entity[F("lightBrightness")] = _lightBrightness;
        entity[F("lightColor")] = EDUtils::formatString("%d,%d,%d", _lightColor.r, _lightColor.g, _lightColor.b);
        entity[F("lightColorTemp")] = _lightTempColor;

        if (_warmFloorCurrentTemperature != -1000.0f) {
            entity[F("warmFloorCurrentTemperature")] = _warmFloorCurrentTemperature;
        }

        if (_warmFloorMode.length() > 0) {
            entity[F("warmFloorMode")] = _warmFloorMode;
        }

        if (_warmFloorSetPoint != -1000.0f) {
            entity[F("warmFloorSetPoint")] = _warmFloorSetPoint;
        }

        entity[F("warmFloorState")] = _warmFloorState ? "heating" : "idle";

        entity[F("humanDetected1")] = _isHumanDetected1 ? "true" : "false";
    });

    return payload;
}
