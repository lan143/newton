#pragma once

#include <Arduino.h>
#include <consumer.h>

#include "automation/light.h"

class CommandConsumer : public EDMQTT::Consumer
{
public:
    CommandConsumer(
        LightAutomation* lightAutomation
    ) : _lightAutomation(lightAutomation) {}
    void consume(std::string payload);

private:
    LightAutomation* _lightAutomation;
};
