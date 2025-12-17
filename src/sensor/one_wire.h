#pragma once

#include <wirenboard.h>
#include <device/wb_m1w2.h>

#include "config.h"

class OneWire
{
public:
    OneWire(EDWB::WirenBoard* modbus) : _modbus(modbus) {}
    void init(Config config);

    EDWB::Result<float_t> getWarmFloorTemperature() const { return _m1w2->getTemperature(1); }

private:
    EDWB::WirenBoard* _modbus = NULL;
    EDWB::M1W2* _m1w2 = NULL;
};