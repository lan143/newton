#include "one_wire.h"

void OneWire::init(Config* config)
{
    _m1w2 = _modbus->addM1W2(config->addressWBM1W2);
}
