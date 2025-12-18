#pragma once

#include <iarduino_Modbus.h>
#include <discovery.h>
#include <ready.h>

#include "state/state_mgr.h"

class MTD262MB : public EDHealthCheck::Ready
{
public:
    MTD262MB(
        ModbusClient* client,
        EDHA::DiscoveryMgr* discoveryMgr,
        StateMgr* stateMgr
    ) : _client(client), _discoveryMgr(discoveryMgr), _stateMgr(stateMgr) {}

    void init(EDHA::Device* device, std::string stateTopic, uint8_t id, uint8_t address);
    void loop();

    EDHealthCheck::ReadyResult ready()
    {
        return EDHealthCheck::ReadyResult(
            !_isFault,
            _isFault ? EDUtils::formatString("failed to get data from MTD262MB sensor", _id) : ""
        );
    }

private:
    uint8_t _id = 0;
    uint8_t _address = 0;
    unsigned long _lastUpdateTime = 0;
    bool _isFault = false;
    uint32_t _faultCount;

private:
    ModbusClient* _client;
    EDHA::DiscoveryMgr* _discoveryMgr;
    StateMgr* _stateMgr;
};