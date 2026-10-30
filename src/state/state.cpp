#include <Json.h>
#include <ExtStrings.h>
#include "defines.h"
#include "state.h"

bool State::operator==(State& other)
{
    return (*this)._warmFloorCurrentTemperature == other._warmFloorCurrentTemperature
        && (*this)._warmFloorMode == other._warmFloorMode
        && (*this)._warmFloorSetPoint == other._warmFloorSetPoint
        && (*this)._warmFloorState == other._warmFloorState;
}

std::string State::marshalJSON()
{
    std::string payload = EDUtils::buildJson([this](JsonObject entity) {
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
    });

    return payload;
}
