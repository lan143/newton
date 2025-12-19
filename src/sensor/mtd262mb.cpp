#include <Utils.h>

#include "mtd262mb.h"

void MTD262MB::init(EDHA::Device* device, std::string stateTopic, uint8_t id, uint8_t address)
{
    _id = id;
    _address = address;
    const char* chipID = EDUtils::getChipID();

    _discoveryMgr->addBinarySensor(
        device,
        "Human detected",
        "human_detected",
        EDUtils::formatString("human_detected_%d_newton_%s", id, chipID)
    )
        ->setStateTopic(stateTopic)
        ->setValueTemplate(EDUtils::formatString("{{ value_json.humanDetected%d }}", id))
        ->setPayloadOn("true")
        ->setPayloadOff("false")
        ->setDeviceClass("occupancy");
}

void MTD262MB::loop()
{
    if ((_lastUpdateTime + 1000) < millis()) {
        auto isHumanDetected = _client->inputRegisterRead(_address, 0x0);
        if (isHumanDetected != -1) {
            _isFault = false;
            _faultCount = 0;

            switch (_id) {
                case 1:
                    _stateMgr->getState().updateHumanDetected1(isHumanDetected == 1);
                    break;
            }
        } else {
            _faultCount++;

            if (_faultCount >= 20) {
                _isFault = true;
            }
        }

        _lastUpdateTime = millis();
    }
}
