#include <Arduino.h>
#include <ArduinoOTA.h>
#include <SPIFFS.h>
#include <ConfigMgr.h>
#include <esp_log.h>
#include <discovery.h>
#include <mqtt.h>
#include <healthcheck.h>

#include <wirenboard.h>
#include <device/wb_msw.h>
#include <device/wb_led.h>

#include "defines.h"
#include "config.h"
#include "automation/light.h"
#include "command/command_consumer.h"
#include "command/switch_command_consumer.h"
#include "light/backlight.h"
#include "light/main.h"
#include "network/network.h"
#include "state/producer.h"
#include "state/state_mgr.h"
#include "sensor/complex.h"
#include "sensor/mtd262mb.h"
#include "sensor/one_wire.h"
#include "thermostat/thermostat.h"
#include "web/handler.h"

EDConfig::ConfigMgr<Config> configMgr(EEPROM_SIZE);
NetworkMgr networkMgr(configMgr.getConfig(), true);
EDMQTT::MQTT mqtt(configMgr.getConfig().mqtt);
EDWB::WirenBoard modbus(Serial2);

EDHealthCheck::HealthCheck healthCheck;
EDHA::DiscoveryMgr discoveryMgr;
StateProducer stateProducer(&mqtt);
StateMgr stateMgr(&stateProducer);

MainLight mainLight(&modbus);
Backlight backlight(&modbus);

ComplexSensor complexSensor(&discoveryMgr, &stateMgr, &modbus);
MTD262MB mtd262mb(modbus.getClient(), &discoveryMgr, &stateMgr);
OneWire oneWireModbus(&modbus);

Thermostat warmFloor(&configMgr, &discoveryMgr, &stateMgr, &oneWireModbus);

LightAutomation lightAutomation(&configMgr, &discoveryMgr, &backlight, &mainLight, &stateMgr);

SwitchCommandConsumer lightSwitchConsumer(&lightAutomation);
CommandConsumer commandConsumer(&lightAutomation, &warmFloor);

Handler handler(&configMgr, &networkMgr, &stateMgr, &healthCheck, &modbus);

void setup()
{
    randomSeed(micros());

    Serial.begin(SERIAL_SPEED);

    ESP_LOGI("setup", "Newton");
    ESP_LOGI("setup", "start");

    SPIFFS.begin(true);

    configMgr.setDefault([](Config& config) {
        snprintf(config.wifiAPSSID, WIFI_SSID_LEN, "Newton_%s", EDUtils::getMacAddress().c_str());
        snprintf(config.mqttStateTopic, MQTT_TOPIC_LEN, "newton/%s/state", EDUtils::getChipID());
        snprintf(config.mqttCommandTopic, MQTT_TOPIC_LEN, "newton/%s/set", EDUtils::getChipID());
        snprintf(config.mqttLightSwitchCommandTopic, MQTT_TOPIC_LEN, "newton/%s/light/switch", EDUtils::getChipID());
        snprintf(config.mqttHADiscoveryPrefix, MQTT_TOPIC_LEN, "homeassistant");
        config.modbusSpeed = 9600;
        config.addressWBMSW = 1;
        config.addressWBLED1 = 3;
        config.addressWBLED2 = 4;
        config.addressWBM1W2 = 5;
        config.addressMTD262MB = 6;
    });
    configMgr.load();

    Serial2.begin(configMgr.getConfig().modbusSpeed, SERIAL_8N1, RS485RX, RS485TX);
    modbus.init(15);

    networkMgr.init();

    ArduinoOTA.setPassword("somestrongpassword");
    ArduinoOTA.begin();

    commandConsumer.init(configMgr.getConfig().mqttCommandTopic);

    mqtt.init();
    networkMgr.OnConnect([&](bool isConnected) {
        if (isConnected) {
            mqtt.connect();
        } else {
            mqtt.disconnect();
        }
    });
    healthCheck.registerService(&mqtt);
    mqtt.subscribe(&commandConsumer);

    stateProducer.init(configMgr.getConfig().mqttStateTopic);

    handler.init();

    discoveryMgr.init(
        configMgr.getConfig().mqttHADiscoveryPrefix,
        configMgr.getConfig().mqttIsHADiscovery,
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

    lightSwitchConsumer.init(configMgr.getConfig().mqttLightSwitchCommandTopic);
    mqtt.subscribe(&lightSwitchConsumer);

    complexSensor.init(device, configMgr.getConfig().mqttStateTopic, configMgr.getConfig().addressWBMSW);
    mtd262mb.init(device, configMgr.getConfig().mqttStateTopic, 1, configMgr.getConfig().addressMTD262MB);
    healthCheck.registerService(&mtd262mb);
    oneWireModbus.init(configMgr.getConfig());

    mainLight.init(configMgr.getConfig().addressWBLED1);
    backlight.init(configMgr.getConfig().addressWBLED2);

    lightAutomation.init(device, configMgr.getConfig().mqttStateTopic, configMgr.getConfig().mqttCommandTopic, configMgr.getConfig().mqttLightSwitchCommandTopic);

    warmFloor.init(device, configMgr.getConfig().mqttStateTopic, configMgr.getConfig().mqttCommandTopic, RELAY_WARM_FLOOR);
    healthCheck.registerService(&warmFloor);

    ESP_LOGI("setup", "complete");
}

void loop()
{
    networkMgr.loop();
    discoveryMgr.loop();
    ArduinoOTA.handle();
    healthCheck.loop();
    complexSensor.loop();
    stateMgr.loop();
    lightAutomation.loop();
    warmFloor.loop();
    mtd262mb.loop();
}
