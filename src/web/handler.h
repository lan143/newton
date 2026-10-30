#pragma once

#ifdef ESP32
    #include <AsyncTCP.h>
#elif defined(ESP8266)
    #include <ESPAsyncTCP.h>
#endif

#include <ESPAsyncWebServer.h>
#include <automation/light.h>
#include <binary_sensor/binary_sensor.h>
#include <data_mgr.h>
#include <healthcheck.h>
#include <network/network.h>
#include <network/network_api.h>
#include <sensor/sensor.h>
#include <state/state_mgr.h>
#include <wirenboard.h>

#include "config.h"
#include "control/light_cache.h"
#include "state/state.h"
#include "thermostat/thermostat.h"
class Handler {
public:
    Handler(
        EDConfig::DataMgr<Config>* configMgr,
        EDNetwork::NetworkMgr* networkMgr,
        EDNetwork::NetworkApi* networkApi,
        EDHealthCheck::HealthCheck* healthCheck,
        EDWB::WirenBoard* modbus,
        EDCommon::Sensor::Sensor* const* sensors[],
        EDCommon::BinarySensor::BinarySensor* const* presence,
        EDUtils::StateMgr<State>* stateMgr,
        Thermostat* warmFloor,
        LightCache* lightCache,
        EDCommon::Light::Light* const* mainLight,
        EDCommon::Light::Light* const* backLight,
        EDCommon::Automation::Light* const* automation
    ) : _configMgr(configMgr), _networkMgr(networkMgr), _networkApi(networkApi),
        _healthCheck(healthCheck), _modbus(modbus),
        _sensors(sensors), _presence(presence), _stateMgr(stateMgr), _warmFloor(warmFloor),
        _lightCache(lightCache), _mainLight(mainLight), _backLight(backLight), _automation(automation) {
        _server = new AsyncWebServer(80);
    }

    void init();

private:
    AsyncWebServer* _server;
    EDConfig::DataMgr<Config>* _configMgr;
    EDNetwork::NetworkMgr* _networkMgr;
    EDNetwork::NetworkApi* _networkApi;
    EDHealthCheck::HealthCheck* _healthCheck;
    EDWB::WirenBoard* _modbus;
    EDCommon::Sensor::Sensor* const** _sensors;
    EDCommon::BinarySensor::BinarySensor* const* _presence;
    EDUtils::StateMgr<State>* _stateMgr;
    Thermostat* _warmFloor;
    LightCache* _lightCache;
    EDCommon::Light::Light* const* _mainLight;
    EDCommon::Light::Light* const* _backLight;
    EDCommon::Automation::Light* const* _automation;
};
