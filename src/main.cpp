#include <Arduino.h>
#include <ArduinoOTA.h>
#include <SPIFFS.h>
#include <data_mgr.h>
#include <storage/littlefs_storage.hpp>
#include <esp_log.h>
#include <discovery.h>
#include <mqtt.h>
#include <healthcheck.h>
#include <state/state_mgr.h>
#include <wirenboard.h>
#include <device/wb_msw.h>
#include <device/wb_led.h>
#include <device/mtd262mb.h>
#include <network/network.h>
#include <network/network_api.h>
#include <log/log.h>
#include <sensor/wbmsw_temperature.h>
#include <sensor/wbmsw_humidity.h>
#include <sensor/wbmsw_air_quality.h>
#include <sensor/wbmsw_co2.h>
#include <sensor/wbmsw_light_level.h>
#include <binary_sensor/mtd262mb.h>
#include <light/wb_led_cct.h>
#include <light/wb_led_rgbw.h>
#include <automation/light.h>

#include "defines.h"
#include "config.h"
#include "config_migration.h"
#include "command/command_consumer.h"
#include "control/light_cache.h"
#include "state/producer.h"
#include "state/state_mgr.h"
#include "sensor/one_wire.h"
#include "state/state.h"
#include "state/producer.h"
#include "thermostat/thermostat.h"
#include "web/handler.h"

EDConfig::DataMgr<Config> configMgr(new EDConfig::StorageLittleFS<Config>("/config.bin"));
EDNetwork::NetworkMgr networkMgr;
EDNetwork::NetworkApi networkApi(networkMgr);
EDMQTT::MQTT mqtt;
EDWB::WirenBoard modbus(Serial2);

EDHealthCheck::HealthCheck healthCheck;
EDHA::DiscoveryMgr discoveryMgr;
StateProducer stateProducer(&mqtt);
EDUtils::StateMgr<State> stateMgr(&stateProducer);

EDCommon::Sensor::Sensor* temperatureSensor = nullptr;
EDCommon::Sensor::Sensor* humiditySensor = nullptr;
EDCommon::Sensor::Sensor* airQualitySensor = nullptr;
EDCommon::Sensor::Sensor* co2Sensor = nullptr;
EDCommon::Sensor::Sensor* lightLevelSensor = nullptr;
EDCommon::BinarySensor::BinarySensor* presenceSensor = nullptr;

EDCommon::Sensor::Sensor* const* sensorSlots[] = {
    &temperatureSensor,
    &humiditySensor,
    &airQualitySensor,
    &co2Sensor,
    &lightLevelSensor,
};

EDCommon::Light::Light* mainLight = nullptr;
EDCommon::Light::Light* backLight = nullptr;
EDCommon::Automation::Light* lightAutomation = nullptr;

LightCache lightCache(&mainLight, &backLight);

OneWire oneWireModbus(&modbus);

Thermostat warmFloor(&configMgr, &discoveryMgr, &stateMgr, &oneWireModbus);

CommandConsumer commandConsumer(&warmFloor);

Handler handler(&configMgr, &networkMgr, &networkApi, &healthCheck, &modbus, sensorSlots, &presenceSensor, &stateMgr, &warmFloor, &lightCache, &mainLight, &backLight, &lightAutomation);

void setup()
{
    randomSeed(micros());
    delay(10000);

    Serial.begin(SERIAL_SPEED);

    esp_log_level_set("*", ESP_LOG_VERBOSE);

    LOGI("setup", "Newton");
    LOGI("setup", "start");

    LOGI("setup", "littlefs begin");
    if (!LittleFS.begin(true)) {
        LOGE("setup", "failed to init littlefs");
        return;
    }

    configMgr.setDefault([](Config* config) {
        snprintf(config->wifiAPSSID, WIFI_SSID_LEN, "Newton_%s", EDUtils::getMacAddress().c_str());
        snprintf(config->mqttTopicPrefix, MQTT_TOPIC_LEN, "newton/%s", EDUtils::getChipID());
        snprintf(config->mqttHADiscoveryPrefix, MQTT_TOPIC_LEN, "homeassistant");
        config->modbusSpeed = 9600;
        config->addressWBMSW = 1;
        config->addressWBLED1 = 3;
        config->addressWBLED2 = 4;
        config->addressWBM1W2 = 5;
        config->addressMTD262MB = 6;
    });
    migrateConfigV1ToV2(configMgr);
    configMgr.load();

    std::string prefix = configMgr.getData()->mqttTopicPrefix;
    char warmFloorStateTopic[MQTT_TOPIC_LEN] = {0};
    char warmFloorCommandTopic[MQTT_TOPIC_LEN] = {0};
    snprintf(warmFloorStateTopic, sizeof(warmFloorStateTopic), "%s/warm_floor/state", configMgr.getData()->mqttTopicPrefix);
    snprintf(warmFloorCommandTopic, sizeof(warmFloorCommandTopic), "%s/warm_floor/set", configMgr.getData()->mqttTopicPrefix);

    lightCache.init(configMgr.getData()->mqttTopicPrefix);
    lightCache.seedFromFile();

    // tmp
    EDUtils::LogConfig networkConfig;
    strcpy(networkConfig.host, "192.168.1.2");
    networkConfig.port = 5555;
    strcpy(networkConfig.uri, "/_bulk");

    networkLogger.init(networkConfig, CONTROLLER_NAME, EDUtils::formatString("Newton_%s", EDUtils::getMacAddress().c_str()));

    Serial2.begin(configMgr.getData()->modbusSpeed, SERIAL_8N1, RS485RX, RS485TX);
    modbus.init(15);

    networkMgr.init(configMgr.getData()->asNetworkConfig(), false, ETH_ADDR, -1, ETH_MDC_PIN, ETH_MDIO_PIN, ETH_TYPE, ETH_CLK_MODE);

    ArduinoOTA.setPassword("somestrongpassword");
    ArduinoOTA.begin();

    commandConsumer.init(warmFloorCommandTopic);

    mqtt.init(configMgr.getData()->mqtt);
    networkMgr.OnConnect([&](bool isConnected) {
        networkLogger.enable(isConnected);
        LOGD("network", "network event. connected: %s", isConnected ? "true" : "false");

        if (isConnected) {
            mqtt.connect();
        } else {
            mqtt.disconnect();
        }
    });
    healthCheck.registerService(&mqtt);
    mqtt.subscribe(&commandConsumer);
    mqtt.subscribe(lightCache.consumer());

    stateProducer.init(warmFloorStateTopic);

    handler.init();

    discoveryMgr.init(
        configMgr.getData()->mqttHADiscoveryPrefix,
        configMgr.getData()->mqttIsHADiscovery,
        [](std::string topicName, std::string payload) {
            return mqtt.publish(topicName.c_str(), payload.c_str(), true);
        }
    );

    EDHA::Device* device = discoveryMgr.addDevice();
    device->setHWVersion(deviceHWVersion)
        ->setSWVersion(deviceFWVersion)
        ->setModel(deviceModel)
        ->setName(deviceName)
        ->setManufacturer(deviceManufacturer);

    auto* msw = modbus.addMSW(configMgr.getData()->addressWBMSW);
    msw->enableCO2Sensor(true);
    auto* led1 = modbus.addLED(configMgr.getData()->addressWBLED1);
    auto* led2 = modbus.addLED(configMgr.getData()->addressWBLED2);
    auto* mtd = modbus.addMTD262MB(configMgr.getData()->addressMTD262MB);

    temperatureSensor = new EDCommon::Sensor::WBMSWTemperature(msw);
    if (!temperatureSensor->init(2, 10000, {
            EDCommon::Sensor::withMQTT(&mqtt, prefix, "newton", "Temperature"),
            EDCommon::Sensor::withDiscovery(&discoveryMgr, device),
        })) {
        LOGE("setup", "failed to init temperature sensor");
    }

    humiditySensor = new EDCommon::Sensor::WBMSWHumidity(msw);
    if (!humiditySensor->init(2, 10000, {
            EDCommon::Sensor::withMQTT(&mqtt, prefix, "newton", "Humidity"),
            EDCommon::Sensor::withDiscovery(&discoveryMgr, device),
        })) {
        LOGE("setup", "failed to init humidity sensor");
    }

    airQualitySensor = new EDCommon::Sensor::WBMSWAirQuality(msw);
    if (!airQualitySensor->init(0, 10000, {
            EDCommon::Sensor::withMQTT(&mqtt, prefix, "newton", "Air quality"),
            EDCommon::Sensor::withDiscovery(&discoveryMgr, device),
            EDCommon::Sensor::withKalmanFilter(65, 10.0f),
        })) {
        LOGE("setup", "failed to init air quality sensor");
    }

    co2Sensor = new EDCommon::Sensor::WBMSWCO2(msw);
    if (!co2Sensor->init(0, 10000, {
            EDCommon::Sensor::withMQTT(&mqtt, prefix, "newton", "CO2"),
            EDCommon::Sensor::withDiscovery(&discoveryMgr, device),
        })) {
        LOGE("setup", "failed to init co2 sensor");
    }

    lightLevelSensor = new EDCommon::Sensor::WBMSWLightLevel(msw);
    if (!lightLevelSensor->init(2, 10000, {
            EDCommon::Sensor::withMQTT(&mqtt, prefix, "newton", "Light level"),
            EDCommon::Sensor::withDiscovery(&discoveryMgr, device),
        })) {
        LOGE("setup", "failed to init light level sensor");
    }

    presenceSensor = new EDCommon::BinarySensor::MTD262MB(mtd);
    if (!presenceSensor->init(1000, {
            EDCommon::BinarySensor::withMQTT(&mqtt, prefix, "newton", "Human detected 1"),
            EDCommon::BinarySensor::withDiscovery(&discoveryMgr, device),
        })) {
        LOGE("setup", "failed to init presence sensor");
    }

    oneWireModbus.init(configMgr.getData());

    auto* mainLightCCT = new EDCommon::Light::WBLedCCT(led1);
    if (!mainLightCCT->init(1, 1, {
            EDCommon::Light::withMQTT(&mqtt, prefix, "newton", "Light"),
            EDCommon::Light::withDiscovery(&discoveryMgr, device),
        })) {
        LOGE("setup", "failed to init main light");
    }
    mainLight = mainLightCCT;

    auto* backLightRGBW = new EDCommon::Light::WBLedRGBW(led2);
    if (!backLightRGBW->init(0, {
            EDCommon::Light::withMQTT(&mqtt, prefix, "newton", "Backlight"),
            EDCommon::Light::withDiscovery(&discoveryMgr, device),
        })) {
        LOGE("setup", "failed to init backlight");
    }
    backLight = backLightRGBW;

    lightAutomation = new EDCommon::Automation::Light(mainLight, backLight, presenceSensor);
    if (!lightAutomation->init("/light_state.bin", {
            EDCommon::Automation::withMQTT(&mqtt, prefix, "newton", "Light automation"),
            EDCommon::Automation::withDiscovery(&discoveryMgr, device),
            EDCommon::Automation::withLightLevelSensor(lightLevelSensor, 150.0f),
            EDCommon::Automation::withNightMode(),
        })) {
        LOGE("setup", "failed to init light automation");
    }

    warmFloor.init(device, warmFloorStateTopic, warmFloorCommandTopic, RELAY_WARM_FLOOR);
    healthCheck.registerService(&warmFloor);

    LOGI("setup", "complete");
}

void loop()
{
    networkMgr.loop();
    discoveryMgr.loop();
    ArduinoOTA.handle();
    healthCheck.loop();
    if (temperatureSensor) temperatureSensor->update();
    if (humiditySensor) humiditySensor->update();
    if (airQualitySensor) airQualitySensor->update();
    if (co2Sensor) co2Sensor->update();
    if (lightLevelSensor) lightLevelSensor->update();
    stateMgr.loop();
    if (mainLight) mainLight->update();
    if (backLight) backLight->update();
    if (lightAutomation) lightAutomation->update();
    warmFloor.loop();
    if (presenceSensor) presenceSensor->update();
    networkLogger.update();
    lightCache.update();
}
