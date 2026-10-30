#include <ArduinoJson.h>
#include <Json.h>
#include <ExtStrings.h>
#include "defines.h"
#include "command.h"

bool Command::unmarshalJSON(const char* data)
{
    return EDUtils::parseJson(data, [this](JsonObject root) {
        if (root.containsKey(F("warmFloorMode"))) {
            _hasWarmFloorMode = true;
            _warmFloorMode.assign(root[F("warmFloorMode")].as<const char*>());
        }

        if (root.containsKey(F("warmFloorSetPoint"))) {
            _hasWarmFloorSetPoint = true;
            _warmFloorSetPoint = root[F("warmFloorSetPoint")].as<float>();
        }

        return true;
    });
}
