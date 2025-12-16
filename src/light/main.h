#pragma once

#include <wirenboard.h>
#include <device/wb_led.h>
#include "light.h"

class MainLight : public Light
{
public:
    MainLight(EDWB::WirenBoard* modbus) : _modbus(modbus) {}

    void init(uint8_t address);

    void setEnabled(bool enabled);
    EDWB::Result<bool> isEnabled() const;

    void setBrightness(uint8_t brightness);
    EDWB::Result<uint8_t> getBrightness() const;

    void setColorTemperature(uint32_t colorTemp);
    EDWB::Result<uint32_t> getColorTemperature() const;

private:
    EDWB::WirenBoard* _modbus = NULL;
    EDWB::LED* _led1 = NULL;
};
