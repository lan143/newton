#include <ArduinoJSON.h>
#include <FS.h>
#include <LittleFS.h>
#include <esp_system.h>
#include <ExtStrings.h>
#include <Json.h>
#include <cmath>
#include <cstring>
#include <string.h>
#include <automation/light.h>
#include <backup/config_backup_handler.hpp>
#include <backup/config_file_handler.hpp>
#include <enum/modes.h>
#include <log/log.h>
#include <network/network_api.h>
#include "defines.h"
#include "handler.h"

namespace
{
    const EDConfig::BackupFileSpec BACKUP_FILES[] = {
        {"config.bin", "/config.bin", sizeof(Config), CURRENT_VERSION, true},
        {"light_state.bin", "/light_state.bin", sizeof(EDCommon::Automation::LightState), 0, false},
    };

    constexpr size_t BACKUP_FILE_COUNT = sizeof(BACKUP_FILES) / sizeof(BACKUP_FILES[0]);

    struct SensorSpec
    {
        const char* id;
        const char* name;
        const char* unit;
    };

    const SensorSpec SENSOR_SPECS[] = {
        {"temperature", "Temperature", "°C"},
        {"humidity", "Humidity", "%"},
        {"air_quality", "Air quality", ""},
        {"co2", "CO2", "ppm"},
        {"light_level", "Light level", "lx"},
    };

    struct LightSpec
    {
        const char* id;
        const char* name;
        bool hasColor;
    };

    const LightSpec LIGHT_SPECS[] = {
        {"main", "Main light", false},
        {"back", "Backlight", true},
    };

    void writeLightJson(JsonObject item, const LightSpec& spec, const LightCache::Snapshot& snap)
    {
        item["id"] = spec.id;
        item["name"] = spec.name;
        item["hasColor"] = spec.hasColor;
        item["enabled"] = snap.enabledValid ? snap.enabled : false;
        item["enabledAvailable"] = snap.enabledValid;
        item["brightness"] = snap.brightnessValid ? snap.brightness : 0;
        item["brightnessAvailable"] = snap.brightnessValid;
        item["temperature"] = snap.temperatureValid ? snap.temperature : 0;
        item["temperatureAvailable"] = snap.temperatureValid;
        item["colorAvailable"] = snap.colorValid;
        item["colorR"] = snap.colorValid ? snap.color.r : 0;
        item["colorG"] = snap.colorValid ? snap.color.g : 0;
        item["colorB"] = snap.colorValid ? snap.color.b : 0;
    }

    bool parseEnabled(const String& value, bool& out)
    {
        if (value.equalsIgnoreCase("on") || value.equalsIgnoreCase("true")) {
            out = true;
            return true;
        }
        if (value.equalsIgnoreCase("off") || value.equalsIgnoreCase("false")) {
            out = false;
            return true;
        }
        return false;
    }

    bool parseRgb(const std::string& value, uint8_t& r, uint8_t& g, uint8_t& b)
    {
        auto parts = EDUtils::split(value, ",");
        if (parts.size() != 3) {
            return false;
        }

        int ir, ig, ib;
        if (EDUtils::str2int(&ir, parts[0].c_str(), 10) != EDUtils::STR2INT_SUCCESS
            || EDUtils::str2int(&ig, parts[1].c_str(), 10) != EDUtils::STR2INT_SUCCESS
            || EDUtils::str2int(&ib, parts[2].c_str(), 10) != EDUtils::STR2INT_SUCCESS) {
            return false;
        }

        if (ir < 0 || ir > 255 || ig < 0 || ig > 255 || ib < 0 || ib > 255) {
            return false;
        }

        r = (uint8_t)ir;
        g = (uint8_t)ig;
        b = (uint8_t)ib;
        return true;
    }

    void rebootAfterCommit()
    {
        delay(200);
        ESP.restart();
    }
}

void Handler::init()
{
    _server->serveStatic("/", LittleFS, "/").setDefaultFile("index.html");

    _healthCheck->registerHandlers(_server);

    _networkApi->onSettingsChanged([this](const EDNetwork::Config& cfg) {
        auto config = _configMgr->getData();

        strncpy(config->wifiSSID, cfg.wifiSSID, WIFI_SSID_LEN);
        config->wifiSSID[WIFI_SSID_LEN - 1] = '\0';
        strncpy(config->wifiPassword, cfg.wifiPassword, WIFI_PWD_LEN);
        config->wifiPassword[WIFI_PWD_LEN - 1] = '\0';
        config->isAPMode = cfg.isAPMode;
        strncpy(config->wifiAPSSID, cfg.wifiAPSSID, WIFI_SSID_LEN);
        config->wifiAPSSID[WIFI_SSID_LEN - 1] = '\0';
        config->wifiAPHasPassword = cfg.wifiAPHasPassword;
        strncpy(config->wifiAPPassword, cfg.wifiAPPassword, WIFI_PWD_LEN);
        config->wifiAPPassword[WIFI_PWD_LEN - 1] = '\0';

        return _configMgr->store();
    });
    _networkApi->registerRoutes(*_server);

    static EDConfig::ConfigBackupHandler backupHandler({
        BACKUP_FILES,
        BACKUP_FILE_COUNT,
        "newton-config.zip",
        0,
        rebootAfterCommit
    });
    backupHandler.registerHandlers(_server);

    static EDConfig::ConfigFileHandler configFileHandler({
        "/config.bin",
        sizeof(Config),
        CURRENT_VERSION,
        true,
        rebootAfterCommit
    });
    configFileHandler.registerHandlers(_server);

    _server->on("/api/settings/modbus", HTTP_GET, [this](AsyncWebServerRequest *request) {
        AsyncResponseStream *response = request->beginResponseStream("application/json");

        std::string payload = EDUtils::buildJson([this](JsonObject entity) {
            auto config = _configMgr->getData();

            entity["modbusSpeed"] = config->modbusSpeed;
            entity["addressWBMSW"] = config->addressWBMSW;
            entity["addressWBLED1"] = config->addressWBLED1;
            entity["addressWBLED2"] = config->addressWBLED2;
            entity["addressWBM1W2"] = config->addressWBM1W2;

            entity["addressMTD262MB"] = config->addressMTD262MB;
        });

        response->write(payload.c_str());
        request->send(response);
    });


    _server->on("/api/settings/modbus", HTTP_POST, [this](AsyncWebServerRequest *request) {
        if (
            !request->hasParam("modbusSpeed", true)
            || !request->hasParam("addressWBMSW", true)
            || !request->hasParam("addressWBLED1", true)
            || !request->hasParam("addressWBLED2", true)
            || !request->hasParam("addressWBM1W2", true)
            || !request->hasParam("addressMTD262MB", true)
        ) {
            request->send(422, "application/json", "{\"message\": \"not present modbus params in request\"}");
            return;
        }

        const AsyncWebParameter* modbusSpeedParam = request->getParam("modbusSpeed", true);
        const AsyncWebParameter* addressWBMSWParam = request->getParam("addressWBMSW", true);
        const AsyncWebParameter* addressWBLED1Param = request->getParam("addressWBLED1", true);
        const AsyncWebParameter* addressWBLED2Param = request->getParam("addressWBLED2", true);
        const AsyncWebParameter* addressWBM1W2Param = request->getParam("addressWBM1W2", true);

        const AsyncWebParameter* addressMTD262MBParam = request->getParam("addressMTD262MB", true);

        int modbusSpeed;
        if (EDUtils::str2int(&modbusSpeed, modbusSpeedParam->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS) {
            request->send(422, "application/json", "{\"message\": \"Incorrect modbus speed\"}");
            return;
        }

        switch (modbusSpeed) {
            case 1200:
                break;
            case 2400:
                break;
            case 4800:
                break;
            case 9600:
                break;
            case 19200:
                break;
            case 38400:
                break;
            case 57600:
                break;
            case 115200:
                break;
            default:
                request->send(422, "application/json", "{\"message\": \"Unsupported modbus speed\"}");
                return;
        }

        int addressWBMSW;
        if (EDUtils::str2int(&addressWBMSW, addressWBMSWParam->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS
            || addressWBMSW < 1 || addressWBMSW > 254) {
            request->send(422, "application/json", "{\"message\": \"Incorrect address WB-MSW\"}");
            return;
        }

        int addressWBLED1;
        if (EDUtils::str2int(&addressWBLED1, addressWBLED1Param->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS
            || addressWBLED1 < 1 || addressWBLED1 > 254) {
            request->send(422, "application/json", "{\"message\": \"Incorrect address WB-LED 1\"}");
            return;
        }

        int addressWBLED2;
        if (EDUtils::str2int(&addressWBLED2, addressWBLED2Param->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS
            || addressWBLED2 < 1 || addressWBLED2 > 254) {
            request->send(422, "application/json", "{\"message\": \"Incorrect address WB-LED 2\"}");
            return;
        }

        int addressWBM1W2;
        if (EDUtils::str2int(&addressWBM1W2, addressWBM1W2Param->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS
            || addressWBM1W2 < 1 || addressWBM1W2 > 254) {
            request->send(422, "application/json", "{\"message\": \"Incorrect address WB-M1W2\"}");
            return;
        }

        int addressMTD262MB;
        if (EDUtils::str2int(&addressMTD262MB, addressMTD262MBParam->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS
            || addressMTD262MB < 1 || addressMTD262MB > 254) {
            request->send(422, "application/json", "{\"message\": \"Incorrect address MTD262MB 1\"}");
            return;
        }

        auto config = _configMgr->getData();
        if (modbusSpeed != config->modbusSpeed) {
            _modbus->changeSpeed(modbusSpeed);
        }

        config->modbusSpeed = modbusSpeed;
        config->addressWBMSW = addressWBMSW;
        config->addressWBLED1 = addressWBLED1;
        config->addressWBLED2 = addressWBLED2;
        config->addressWBM1W2 = addressWBM1W2;
        config->addressMTD262MB = addressMTD262MB;

        _configMgr->store();

        request->send(200, "application/json", "{}");
    });

    _server->on("/api/settings/mqtt", HTTP_GET, [this](AsyncWebServerRequest *request) {
        AsyncResponseStream *response = request->beginResponseStream("application/json");

        std::string payload = EDUtils::buildJson([this](JsonObject entity) {
            auto config = _configMgr->getData();

            entity["host"] = config->mqtt.host;
            entity["port"] = config->mqtt.port;
            entity["login"] = config->mqtt.login;
            entity["password"] = config->mqtt.password;
            entity["haDiscoveryPrefix"] = config->mqttHADiscoveryPrefix;
            entity["mqttIsHADiscovery"] = config->mqttIsHADiscovery;
            entity["topicPrefix"] = config->mqttTopicPrefix;
        });

        response->write(payload.c_str());
        request->send(response);
    });

    _server->on("/api/settings/mqtt", HTTP_POST, [this](AsyncWebServerRequest *request) {
        if (
            !request->hasParam("host", true)
            || !request->hasParam("port", true)
            || !request->hasParam("login", true)
            || !request->hasParam("password", true)
            || !request->hasParam("haDiscoveryPrefix", true)
            || !request->hasParam("topicPrefix", true)
            || !request->hasParam("mqttIsHADiscovery", true)
        ) {
            request->send(422, "application/json", "{\"message\": \"not present mqtt params in request\"}");
            return;
        }

        auto config = _configMgr->getData();
        const AsyncWebParameter* host = request->getParam("host", true);
        const AsyncWebParameter* port = request->getParam("port", true);
        const AsyncWebParameter* login = request->getParam("login", true);
        const AsyncWebParameter* password = request->getParam("password", true);
        const AsyncWebParameter* haDiscoveryPrefix = request->getParam("haDiscoveryPrefix", true);
        const AsyncWebParameter* ishaDiscoveryEnabled = request->getParam("mqttIsHADiscovery", true);
        const AsyncWebParameter* topicPrefix = request->getParam("topicPrefix", true);

        if (host->value().length() == 0 || host->value().length() > HOST_LEN-1) {
            request->send(422, "application/json", "{\"message\": \"MQTT host lenght invalid\"}");
            return;
        }

        int mqttPort;
        if (EDUtils::str2int(&mqttPort, port->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS) {
            request->send(422, "application/json", "{\"message\": \"Incorrect port\"}");
            return;
        }

        if (login->value().length() > MQTT_LOGIN_LEN-1) {
            request->send(422, "application/json", "{\"message\": \"MQTT login length invalid\"}");
            return;
        }

        if (password->value().length() > MQTT_PASSWORD_LEN-1) {
            request->send(422, "application/json", "{\"message\": \"MQTT password length invalid\"}");
            return;
        }

        if (haDiscoveryPrefix->value().length() == 0) {
            request->send(422, "application/json", "{\"message\": \"You must specify mqtt topic name\"}");
            return;
        }

        if (haDiscoveryPrefix->value().length() > MQTT_TOPIC_LEN-1) {
            request->send(422, "application/json", "{\"message\": \"HA discovery prefix length invalid\"}");
            return;
        }

        if (topicPrefix->value().length() == 0 || topicPrefix->value().length() > MQTT_TOPIC_PREFIX_MAX_LEN) {
            request->send(422, "application/json", "{\"message\": \"topic prefix length invalid\"}");
            return;
        }

        strcpy(config->mqtt.host, host->value().c_str());
        config->mqtt.port = (uint16_t)mqttPort;
        strcpy(config->mqtt.login, login->value().c_str());
        strcpy(config->mqtt.password, password->value().c_str());
        strcpy(config->mqttHADiscoveryPrefix, haDiscoveryPrefix->value().c_str());
        snprintf(config->mqttTopicPrefix, MQTT_TOPIC_LEN, "%s", topicPrefix->value().c_str());

        if (strcmp(ishaDiscoveryEnabled->value().c_str(), "true") == 0) {
            config->mqttIsHADiscovery = true;
        } else {
            config->mqttIsHADiscovery = false;
        }

        _configMgr->store();

        request->send(200, "application/json", "{}");
    });

    _server->on("/api/sensors", HTTP_GET, [this](AsyncWebServerRequest *request) {
        AsyncResponseStream *response = request->beginResponseStream("application/json");

        std::string payload = EDUtils::buildJson([this](JsonObject root) {
            JsonArray sensors = root["sensors"].to<JsonArray>();

            for (size_t i = 0; i < sizeof(SENSOR_SPECS) / sizeof(SENSOR_SPECS[0]); i++) {
                JsonObject item = sensors.add<JsonObject>();
                item["id"] = SENSOR_SPECS[i].id;
                item["name"] = SENSOR_SPECS[i].name;
                item["unit"] = SENSOR_SPECS[i].unit;

                EDCommon::Sensor::Sensor* sensor = _sensors[i] != nullptr ? *_sensors[i] : nullptr;
                if (sensor != nullptr) {
                    auto value = sensor->getValue();
                    item["available"] = value.second;
                    item["value"] = value.second ? value.first : 0.0f;
                } else {
                    item["available"] = false;
                    item["value"] = 0.0f;
                }
            }

            {
                JsonObject item = sensors.add<JsonObject>();
                item["id"] = "human_detected_1";
                item["name"] = "Human detected 1";
                item["unit"] = "";

                EDCommon::BinarySensor::BinarySensor* presence = _presence != nullptr ? *_presence : nullptr;
                if (presence != nullptr) {
                    auto active = presence->isActive();
                    item["available"] = active.second;
                    item["value"] = active.second ? active.first : false;
                } else {
                    item["available"] = false;
                    item["value"] = false;
                }
            }

            JsonObject warmFloor = root["warmFloor"].to<JsonObject>();
            auto thermostatState = _configMgr->getData()->thermostatState;
            warmFloor["mode"] = thermostatState.mode == THERMOSTAT_MODE_HEAT ? "heat" : "off";
            warmFloor["setPoint"] = thermostatState.setPoint;

            if (_stateMgr != nullptr) {
                auto& state = _stateMgr->getState();
                auto& currentTemperature = state.warmFloorCurrentTemperature();
                warmFloor["currentTemperatureAvailable"] = currentTemperature.Valid();
                warmFloor["currentTemperature"] = currentTemperature.Valid() ? currentTemperature.Value() : 0.0f;

                auto& heating = state.warmFloorState();
                warmFloor["heating"] = heating.Valid() ? heating.Value() : false;
            } else {
                warmFloor["currentTemperatureAvailable"] = false;
                warmFloor["currentTemperature"] = 0.0f;
                warmFloor["heating"] = false;
            }

            JsonArray lights = root["lights"].to<JsonArray>();

            const LightCache::Snapshot emptySnapshot;
            const LightCache::Snapshot* mainSnapshot = &emptySnapshot;
            const LightCache::Snapshot* backSnapshot = &emptySnapshot;

            if (_lightCache != nullptr) {
                mainSnapshot = &_lightCache->mainSnapshot();
                backSnapshot = &_lightCache->backSnapshot();
            }

            writeLightJson(lights.add<JsonObject>(), LIGHT_SPECS[0], *mainSnapshot);
            writeLightJson(lights.add<JsonObject>(), LIGHT_SPECS[1], *backSnapshot);

            JsonObject nightMode = root["nightMode"].to<JsonObject>();
            if (_lightCache != nullptr && _lightCache->nightModeValid()) {
                nightMode["value"] = _lightCache->nightMode();
                nightMode["available"] = true;
            } else {
                nightMode["value"] = false;
                nightMode["available"] = false;
            }
        });

        response->write(payload.c_str());
        request->send(response);
    });

    _server->on("/api/warm_floor/set", HTTP_POST, [this](AsyncWebServerRequest *request) {
        const bool hasMode = request->hasParam("warmFloorMode", true);
        const bool hasSetPoint = request->hasParam("warmFloorSetPoint", true);

        if (!hasMode && !hasSetPoint) {
            request->send(422, "application/json", "{\"message\": \"not present warmFloorMode or warmFloorSetPoint in request\"}");
            return;
        }

        EDHA::Mode mode = EDHA::MODE_OFF;
        if (hasMode) {
            const AsyncWebParameter* modeParam = request->getParam("warmFloorMode", true);
            if (modeParam->value().equalsIgnoreCase("off")) {
                mode = EDHA::MODE_OFF;
            } else if (modeParam->value().equalsIgnoreCase("heat")) {
                mode = EDHA::MODE_HEAT;
            } else {
                request->send(422, "application/json", "{\"message\": \"unknown warmFloorMode\"}");
                return;
            }
        }

        float_t setPoint = 0.0f;
        if (hasSetPoint) {
            const AsyncWebParameter* setPointParam = request->getParam("warmFloorSetPoint", true);
            if (EDUtils::str2float(&setPoint, setPointParam->value().c_str()) != EDUtils::STR2INT_SUCCESS) {
                request->send(422, "application/json", "{\"message\": \"incorrect warmFloorSetPoint\"}");
                return;
            }
            if (!std::isfinite(setPoint)) {
                request->send(422, "application/json", "{\"message\": \"incorrect warmFloorSetPoint\"}");
                return;
            }
        }

        if (hasMode) {
            _warmFloor->changeMode(mode);
        }

        if (hasSetPoint) {
            _warmFloor->changeSetPoint(setPoint);
        }

        LOGI("warm_floor", "set mode: %s, setPoint: %.2f",
            hasMode ? (mode == EDHA::MODE_HEAT ? "heat" : "off") : "-",
            hasSetPoint ? setPoint : 0.0f);

        request->send(200, "application/json", "{}");
    });

    _server->on("/api/light/set", HTTP_POST, [this](AsyncWebServerRequest *request) {
        if (!request->hasParam("light", true)) {
            request->send(422, "application/json", "{\"message\": \"not present light param in request\"}");
            return;
        }

        const AsyncWebParameter* lightParam = request->getParam("light", true);

        bool isMain;
        if (lightParam->value().equalsIgnoreCase("main")) {
            isMain = true;
        } else if (lightParam->value().equalsIgnoreCase("back")) {
            isMain = false;
        } else {
            request->send(422, "application/json", "{\"message\": \"unknown light\"}");
            return;
        }

        const bool hasEnabled = request->hasParam("enabled", true);
        const bool hasBrightness = request->hasParam("brightness", true);
        const bool hasTempColor = request->hasParam("tempColor", true);
        const bool hasColor = request->hasParam("color", true);

        if (!hasEnabled && !hasBrightness && !hasTempColor && !hasColor) {
            request->send(422, "application/json", "{\"message\": \"not present control params in request\"}");
            return;
        }

        bool enable = false;
        if (hasEnabled) {
            const AsyncWebParameter* enabledParam = request->getParam("enabled", true);
            if (!parseEnabled(enabledParam->value(), enable)) {
                request->send(422, "application/json", "{\"message\": \"incorrect enabled value\"}");
                return;
            }
        }

        int brightness = 0;
        if (hasBrightness) {
            const AsyncWebParameter* brightnessParam = request->getParam("brightness", true);
            if (EDUtils::str2int(&brightness, brightnessParam->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS
                || brightness < 0 || brightness > 100) {
                request->send(422, "application/json", "{\"message\": \"incorrect brightness value\"}");
                return;
            }
        }

        int tempColor = 0;
        if (hasTempColor) {
            const AsyncWebParameter* tempColorParam = request->getParam("tempColor", true);
            if (EDUtils::str2int(&tempColor, tempColorParam->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS
                || tempColor < 2700 || tempColor > 6000) {
                request->send(422, "application/json", "{\"message\": \"incorrect tempColor value\"}");
                return;
            }
        }

        uint8_t colorR = 0, colorG = 0, colorB = 0;
        if (hasColor) {
            const AsyncWebParameter* colorParam = request->getParam("color", true);
            if (!parseRgb(colorParam->value().c_str(), colorR, colorG, colorB)) {
                request->send(422, "application/json", "{\"message\": \"incorrect color value\"}");
                return;
            }
        }

        if (isMain && hasColor) {
            request->send(422, "application/json", "{\"message\": \"main light has no color control\"}");
            return;
        }

        EDCommon::Light::Light* light = isMain
            ? (_mainLight != nullptr ? *_mainLight : nullptr)
            : (_backLight != nullptr ? *_backLight : nullptr);

        if (light == nullptr) {
            request->send(500, "application/json", "{\"message\": \"light not ready\"}");
            return;
        }

        if (hasEnabled) {
            light->setState(enable);
        }
        if (hasBrightness) {
            light->setBrightness((uint8_t)brightness);
        }
        if (hasTempColor) {
            light->setTemperature((uint16_t)tempColor);
        }
        if (hasColor) {
            light->setColor(CRGB(colorR, colorG, colorB));
        }

        LOGI("light", "set %s enabled=%d brightness=%d tempColor=%d color=%d,%d,%d",
            isMain ? "main" : "back",
            hasEnabled ? (enable ? 1 : 0) : -1,
            hasBrightness ? brightness : -1,
            hasTempColor ? tempColor : -1,
            hasColor ? colorR : -1,
            hasColor ? colorG : -1,
            hasColor ? colorB : -1);

        request->send(200, "application/json", "{}");
    });

    _server->on("/api/light_automation/set", HTTP_POST, [this](AsyncWebServerRequest *request) {
        if (!request->hasParam("enabled", true)) {
            request->send(422, "application/json", "{\"message\": \"not present enabled param in request\"}");
            return;
        }

        const AsyncWebParameter* enabledParam = request->getParam("enabled", true);

        bool enable;
        if (!parseEnabled(enabledParam->value(), enable)) {
            request->send(422, "application/json", "{\"message\": \"incorrect enabled value\"}");
            return;
        }

        EDCommon::Automation::Light* automation = _automation != nullptr ? *_automation : nullptr;
        if (automation == nullptr) {
            request->send(500, "application/json", "{\"message\": \"light automation not ready\"}");
            return;
        }

        automation->changeNightModeState(enable);

        LOGI("light_automation", "set nightMode=%s", enable ? "true" : "false");

        request->send(200, "application/json", "{}");
    });

    _server->on("/api/status", HTTP_GET, [this](AsyncWebServerRequest *request) {
        AsyncResponseStream *response = request->beginResponseStream("application/json");

        std::string data = EDUtils::buildJson([this](JsonObject entity) {
            if (_networkMgr->isConnected()) {
                entity[F("wifiStatus")] = "connected";
            } else {
                entity[F("wifiStatus")] = "disconnected";
            }

            entity[F("freeHeap")] = ESP.getFreeHeap();
            entity[F("uptime")] = esp_timer_get_time() / 1000000;

            esp_reset_reason_t reason = esp_reset_reason();

            switch (reason) {
                case ESP_RST_POWERON:
                    entity[F("lastResetReason")] = "Power-on Reset";
                    break;
                case ESP_RST_EXT:
                    entity[F("lastResetReason")] = "External Reset";
                    break;
                case ESP_RST_SW:
                    entity[F("lastResetReason")] = "Software Reset";
                    break;
                case ESP_RST_PANIC:
                    entity[F("lastResetReason")] = "Panic Reset";
                    break;
                case ESP_RST_INT_WDT:
                    entity[F("lastResetReason")] = "Interrupt Watchdog Reset";
                    break;
                case ESP_RST_TASK_WDT:
                    entity[F("lastResetReason")] = "Task Watchdog Reset";
                    break;
                case ESP_RST_WDT:
                    entity[F("lastResetReason")] = "Other Watchdog Reset";
                    break;
                case ESP_RST_DEEPSLEEP:
                    entity[F("lastResetReason")] = "Wake from Deep Sleep";
                    break;
                case ESP_RST_BROWNOUT:
                    entity[F("lastResetReason")] = "Brownout Reset";
                    break;
                case ESP_RST_SDIO:
                    entity[F("lastResetReason")] = "SDIO Reset";
                    break;
                default:
                    entity[F("lastResetReason")] = "Unknown";
                    break;
            }
        });
        response->print(data.c_str());
        request->send(response);
    });

    _server->on("/api/reboot", HTTP_POST, [this](AsyncWebServerRequest *request) {
        request->send(200, "application/json", "{}");
        delay(200);
        ESP.restart();
    });

    _server->begin();
}
