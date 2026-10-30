#include <Arduino.h>
#include <LittleFS.h>
#include <Utils.h>
#include <ExtStrings.h>
#include <cstring>
#include <color/color.h>
#include <mqtt_config.h>
#include <storage/littlefs_storage.hpp>

#include "config_migration.h"
#include "thermostat/state.h"

namespace
{
    // Frozen copy of src/automation/light_state.h at config version 1.
    struct LightStateV1
    {
        bool nightMode = false;
        bool enabled = false;
        uint8_t brightness = 255;
        uint16_t temperature = 6000;
        CRGB color = CRGB::White;
    };

    // Frozen byte-for-byte copy of the Config layout at version 1. Field order,
    // types and padding must not change; it exists only to read old v1 files.
    struct ConfigV1
    {
        uint8_t version = 1;

        bool isAPMode = true;
        char wifiAPSSID[WIFI_SSID_LEN] = {0};
        bool wifiAPHasPassword = false;
        char wifiAPPassword[WIFI_PWD_LEN] = {0};

        char wifiSSID[WIFI_SSID_LEN] = {0};
        char wifiPassword[WIFI_PWD_LEN] = {0};

        EDMQTT::Config mqtt;

        bool mqttIsHADiscovery = true;
        char mqttHADiscoveryPrefix[MQTT_TOPIC_LEN] = {0};
        char mqttCommandTopic[MQTT_TOPIC_LEN] = {0};
        char legacySwitchCommandTopic[MQTT_TOPIC_LEN] = {0}; // retired light-switch topic; layout unchanged
        char mqttStateTopic[MQTT_TOPIC_LEN] = {0};

        uint32_t modbusSpeed = 0;
        uint8_t addressWBMSW = 0;
        uint8_t addressWBLED1 = 0;
        uint8_t addressWBLED2 = 0;
        uint8_t addressWBM1W2 = 0;
        uint8_t addressMTD262MB = 0;

        LightStateV1 lightState;

        ThermostatState thermostatState;
    };

    bool isV1ConfigFile()
    {
        File file = LittleFS.open("/config.bin", FILE_READ);
        if (!file) {
            return false;
        }

        bool isV1 = file.size() == sizeof(ConfigV1) + sizeof(uint16_t);
        file.close();

        return isV1;
    }

    void deriveTopicPrefix(const char* stateTopic, char* prefix, size_t prefixLength)
    {
        const char* suffix = "/state";
        size_t stateLength = strlen(stateTopic);
        size_t suffixLength = strlen(suffix);

        if (stateLength > suffixLength && strcmp(stateTopic + stateLength - suffixLength, suffix) == 0) {
            size_t length = stateLength - suffixLength;
            // MQTT_TOPIC_PREFIX_MAX_LEN additionally bounds the result so
            // prefix + "/warm_floor/state" fits EDMQTT::Producer::_topic[64].
            if (length < prefixLength && length <= MQTT_TOPIC_PREFIX_MAX_LEN) {
                memcpy(prefix, stateTopic, length);
                prefix[length] = 0;
                return;
            }
        }

        snprintf(prefix, prefixLength, "%s", EDUtils::formatString("newton/%s", EDUtils::getChipID()).c_str());
    }
}

void migrateConfigV1ToV2(EDConfig::DataMgr<Config>& configMgr)
{
    if (!isV1ConfigFile()) {
        return;
    }

    EDConfig::DataMgr<ConfigV1> v1Mgr(new EDConfig::StorageLittleFS<ConfigV1>("/config.bin"));
    v1Mgr.setDefault([](ConfigV1*) {});
    if (!v1Mgr.load()) {
        delete v1Mgr.getData();
        return;
    }

    ConfigV1* oldConfig = v1Mgr.getData();

    // The v1 bytes are already in memory, so the live manager may replace the
    // old file with v2 defaults while it is being initialized.
    configMgr.load();
    Config* newConfig = configMgr.getData();

    newConfig->version = CURRENT_VERSION;
    newConfig->isAPMode = oldConfig->isAPMode;
    memcpy(newConfig->wifiAPSSID, oldConfig->wifiAPSSID, sizeof(newConfig->wifiAPSSID));
    newConfig->wifiAPHasPassword = oldConfig->wifiAPHasPassword;
    memcpy(newConfig->wifiAPPassword, oldConfig->wifiAPPassword, sizeof(newConfig->wifiAPPassword));
    memcpy(newConfig->wifiSSID, oldConfig->wifiSSID, sizeof(newConfig->wifiSSID));
    memcpy(newConfig->wifiPassword, oldConfig->wifiPassword, sizeof(newConfig->wifiPassword));

    newConfig->mqtt = oldConfig->mqtt;
    newConfig->mqttIsHADiscovery = oldConfig->mqttIsHADiscovery;
    memcpy(newConfig->mqttHADiscoveryPrefix, oldConfig->mqttHADiscoveryPrefix, sizeof(newConfig->mqttHADiscoveryPrefix));
    deriveTopicPrefix(oldConfig->mqttStateTopic, newConfig->mqttTopicPrefix, sizeof(newConfig->mqttTopicPrefix));

    newConfig->modbusSpeed = oldConfig->modbusSpeed;
    newConfig->addressWBMSW = oldConfig->addressWBMSW;
    newConfig->addressWBLED1 = oldConfig->addressWBLED1;
    newConfig->addressWBLED2 = oldConfig->addressWBLED2;
    newConfig->addressWBM1W2 = oldConfig->addressWBM1W2;
    newConfig->addressMTD262MB = oldConfig->addressMTD262MB;

    newConfig->thermostatState = oldConfig->thermostatState;

    configMgr.store();

    EDConfig::DataMgr<LightStateV1> lightMgr(new EDConfig::StorageLittleFS<LightStateV1>("/light_state.bin"));
    lightMgr.setDefault([](LightStateV1*) {});
    lightMgr.load();

    LightStateV1 lightState;
    lightState.nightMode = oldConfig->lightState.nightMode;
    lightState.enabled = oldConfig->lightState.enabled;
    lightState.brightness = oldConfig->lightState.brightness;
    lightState.temperature = oldConfig->lightState.temperature;
    lightState.color = oldConfig->lightState.color;

    lightMgr.setData(&lightState);
    lightMgr.store();

    delete oldConfig;
}
