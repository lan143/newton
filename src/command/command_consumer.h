#pragma once

#include <Arduino.h>
#include <consumer.h>

#include "automation/light.h"
#include "thermostat/thermostat.h"

class CommandConsumer : public EDMQTT::Consumer
{
public:
    CommandConsumer(
        LightAutomation* lightAutomation,
        Thermostat* warmFloor
    ) : _lightAutomation(lightAutomation), _warmFloor(warmFloor) {}
    void consume(std::string payload);

private:
    LightAutomation* _lightAutomation;
    Thermostat* _warmFloor;
};
