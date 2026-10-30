#pragma once

#include <Arduino.h>
#include <consumer.h>

#include "thermostat/thermostat.h"

class CommandConsumer : public EDMQTT::Consumer
{
public:
    CommandConsumer(Thermostat* warmFloor) : _warmFloor(warmFloor) {}
    void consume(std::string payload);

private:
    Thermostat* _warmFloor;
};
