#include <enum/modes.h>
#include <enum/device_class.h>

#include "thermostat.h"

#define MIN_TEMPERATURE 16
#define MAX_TEMPERATURE 40

void Thermostat::init(EDHA::Device* device, std::string stateTopic, std::string commandTopic, uint8_t relayPin)
{
    _state = _configMgr->getConfig().thermostatState;
    _stateMgr->setWarmFloorState(_state.isActive);

    _relayPin = relayPin;
    pinMode(_relayPin, OUTPUT);

    if (_state.isActive) {
        digitalWrite(_relayPin, HIGH);
    } else {
        digitalWrite(_relayPin, LOW);
    }

    std::list<EDHA::Mode> modes;
    modes.push_back(EDHA::MODE_OFF);
    modes.push_back(EDHA::MODE_HEAT);

    const char* chipID = EDUtils::getChipID();
    _discoveryMgr->addClimate(
        device,
        "Warm floor",
        "warm_floor",
        EDUtils::formatString("%s_warm_floor_newton", chipID)
    )
        ->setCurrentTemperatureTemplate("{{ value_json.warmFloorCurrentTemperature }}")
        ->setCurrentTemperatureTopic(stateTopic)
        ->setMinTemp(MIN_TEMPERATURE)
        ->setMaxTemp(MAX_TEMPERATURE)
        ->setModeCommandTemplate("{\"warmFloorMode\": \"{{ value }}\"}")
        ->setModeCommandTopic(commandTopic)
        ->setModeStateTemplate("{{ value_json.warmFloorMode }}")
        ->setModeStateTopic(stateTopic)
        ->setTemperatureCommandTemplate("{\"warmFloorSetPoint\": {{ value }}}")
        ->setTemperatureCommandTopic(commandTopic)
        ->setTemperatureStateTemplate("{{ value_json.warmFloorSetPoint }}")
        ->setTemperatureStateTopic(stateTopic)
        ->setModes(modes)
        ->setPayloadOff("false")
        ->setPayloadOn("true")
        ->setActionTopic(stateTopic)
        ->setActionTemplate("{{ value_json.warmFloorState }}");
}

void Thermostat::changeMode(EDHA::Mode mode)
{
    switch (mode) {
    case EDHA::MODE_OFF:
        _state.mode = THERMOSTAT_MODE_OFF;
        break;
    case EDHA::MODE_HEAT:
        _state.mode = THERMOSTAT_MODE_HEAT;
        break;
    default:
        return;
    }

    _stateMgr->setWarmFloorMode(EDHA::mapMode(mode));
    _configMgr->getConfig().thermostatState = _state;
    _configMgr->store();
}

void Thermostat::changeSetPoint(float_t setPoint)
{
    if (setPoint < MIN_TEMPERATURE) {
        setPoint = MIN_TEMPERATURE;
    }

    if (setPoint > MAX_TEMPERATURE) {
        setPoint = MAX_TEMPERATURE;
    }

    _state.setPoint = setPoint;
    _stateMgr->setWarmFloorSetPoint(setPoint);
    _configMgr->getConfig().thermostatState = _state;
    _configMgr->store();
}

void Thermostat::loop()
{
    if ((_loopLastTime + 2000) < millis()) {
        float_t temperature = _oneWireModbus->getWarmFloorTemperature();
        bool isActiveChange = false;

        if (temperature != -1000.0f && (_currentTemperature == 0.0f || abs(temperature - _currentTemperature) < 5.0f)) {
            _isTemperatureSensorFault = false;
            _temperatureSensorFaultCount = 0;

            if (_state.mode == THERMOSTAT_MODE_HEAT) {
                if ((temperature < _state.setPoint) && (_state.setPoint - temperature) > 1.0f) {
                    digitalWrite(_relayPin, HIGH);

                    if (!_state.isActive) {
                        _state.isActive = true;
                        isActiveChange = true;
                    }
                } else if ((temperature > _state.setPoint) && (temperature - _state.setPoint) > 1.0f) {
                    digitalWrite(_relayPin, LOW);

                    if (_state.isActive) {
                        _state.isActive = false;
                        isActiveChange = true;
                    }
                }
            } else {
                digitalWrite(_relayPin, LOW);

                if (_state.isActive) {
                    _state.isActive = false;
                    isActiveChange = true;
                }
            }

            _stateMgr->setWarmFloorCurrentTemperature(temperature);
            _currentTemperature = temperature;
        } else {
            _temperatureSensorFaultCount++;
            if (_temperatureSensorFaultCount > 20) {
                _isTemperatureSensorFault = true;
            }

            if (_isTemperatureSensorFault) {
                digitalWrite(_relayPin, LOW);

                if (_state.isActive) {
                    _state.isActive = false;
                    isActiveChange = true;
                }
            }
        }

        if (isActiveChange) {
            _stateMgr->setWarmFloorState(_state.isActive);
            _configMgr->getConfig().thermostatState = _state;
            _configMgr->store();
        }

        _loopLastTime = millis();
    }
}
