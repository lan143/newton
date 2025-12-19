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
        && (*this)._warmFloorState == other._warmFloorState
        && (*this)._isHumanDetected1 == other._isHumanDetected1;
}

std::string State::marshalJSON()
{
    std::string payload = EDUtils::buildJson([this](JsonObject entity) {
        if (_temperature.Valid()) {
            entity[F("temperature")] = _temperature.Value();
        }

        if (_humidity.Valid()) {
            entity[F("humidity")] = _humidity.Value();
        }

        if (_airQuality.Valid()) {
            entity[F("airQuality")] = _airQuality.Value();
        }

        if (_co2Value.Valid()) {
            entity[F("co2")] = _co2Value.Value();
        }

        if (_lightLevel.Valid()) {
            entity[F("lightLevel")] = _lightLevel.Value();
        }

        if (_isLightNightMode.Valid()) {
            entity[F("lightNightMode")] = _isLightNightMode.Value() ? "true" : "false";
        }

        if (_lightSwitchState.Valid()) {
            entity[F("lightSwitchState")] = _lightSwitchState.Value() ? "ON" : "OFF";
        }

        if (_lightBrightness.Valid()) {
            entity[F("lightBrightness")] = _lightBrightness.Value();
        }

        if (_lightColor.Valid()) {
            entity[F("lightColor")] = EDUtils::formatString("%d,%d,%d", _lightColor.Value().r, _lightColor.Value().g, _lightColor.Value().b);
        }

        if (_lightTempColor.Valid()) {
            entity[F("lightColorTemp")] = _lightTempColor.Value();
        }

        if (_warmFloorCurrentTemperature.Valid()) {
            entity[F("warmFloorCurrentTemperature")] = _warmFloorCurrentTemperature.Value();
        }

        if (_warmFloorMode.Valid()) {
            entity[F("warmFloorMode")] = _warmFloorMode.Value();
        }

        if (_warmFloorSetPoint.Valid()) {
            entity[F("warmFloorSetPoint")] = _warmFloorSetPoint.Value();
        }

        if (_warmFloorState.Valid()) {
            entity[F("warmFloorState")] = _warmFloorState.Value() ? "heating" : "idle";
        }

        if (_isHumanDetected1.Valid()) {
            entity[F("humanDetected1")] = _isHumanDetected1.Value() ? "true" : "false";
        }
    });

    return payload;
}
