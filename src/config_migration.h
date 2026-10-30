#pragma once

#include <data_mgr.h>

#include "config.h"

// Migrates a CRC-valid v1 /config.bin to the v2 layout and moves the light
// automation state into /light_state.bin. No-op when /config.bin is absent or
// is not a v1 file.
void migrateConfigV1ToV2(EDConfig::DataMgr<Config>& configMgr);
