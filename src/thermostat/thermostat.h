#pragma once

#include <ConfigMgr.h>
#include <discovery.h>
#include <state/state_mgr.h>
#include <ready.h>

#include "sensor/one_wire.h"
#include "state.h"

class Thermostat : public EDHealthCheck::Ready
{
public:
    Thermostat(
        EDConfig::ConfigMgr<Config>* configMgr,
        EDHA::DiscoveryMgr* discoveryMgr,
        StateMgr* stateMgr,
        OneWire* oneWireModbus
    ) : _configMgr(configMgr), _discoveryMgr(discoveryMgr), _stateMgr(stateMgr), _oneWireModbus(oneWireModbus) {}
    void init(EDHA::Device* device, std::string stateTopic, std::string commandTopic, uint8_t relayPin);

    void changeMode(EDHA::Mode mode);
    void changeSetPoint(float_t setPoint);

    void loop();

    EDHealthCheck::ReadyResult ready()
    {
        return EDHealthCheck::ReadyResult(
            !_isTemperatureSensorFault,
            _isTemperatureSensorFault ? "fault to get data from temperature sensor" : ""
        );
    }

private:
    uint8_t _relayPin = 0;
    ThermostatState _state;
    float_t _currentTemperature = 0.0f;
    bool _isTemperatureSensorFault = false;
    uint32_t _temperatureSensorFaultCount = 0;
    unsigned long _loopLastTime = 0;

private:
    EDConfig::ConfigMgr<Config>* _configMgr = NULL;
    EDHA::DiscoveryMgr* _discoveryMgr = NULL;
    StateMgr* _stateMgr = NULL;
    OneWire* _oneWireModbus = NULL;
};
