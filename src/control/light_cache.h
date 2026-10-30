#pragma once

#include <Arduino.h>
#include <consumer.h>
#include <color/color.h>
#include <light/light.h>

class LightCache;

// Subscribes to <prefix>/light_automation/state and mirrors the night-mode
// switch state into LightCache. Written from the AsyncTCP/MQTT task, matching
// the CommandConsumer precedent.
class LightAutomationStateConsumer : public EDMQTT::Consumer
{
public:
    LightAutomationStateConsumer(LightCache* cache) : _cache(cache) {}
    void consume(std::string payload);

private:
    LightCache* _cache;
};

// Newton-owned snapshot cache for the two EDCommon lights and the night-mode
// automation state. Live Modbus reads (Light::isEnabled/getBrightness/
// getTemperature) stay on the loop task: update() runs every ~500 ms from
// loop(); the web handler only reads the RAM snapshot.
class LightCache
{
public:
    LightCache(
        EDCommon::Light::Light* const* mainLight,
        EDCommon::Light::Light* const* backLight
    ) : _main(mainLight), _back(backLight), _consumer(this) {}

    // Builds the night-mode state topic from the configured prefix.
    void init(const char* topicPrefix);

    // Refresh the light snapshot; call from loop() every ~500 ms.
    void update();

    // Seed nightMode from byte 0 of /light_state.bin (called once in setup()).
    void seedFromFile();

    // Writes the night-mode state (called by the MQTT consumer).
    void setNightMode(bool enabled);

    // Consumer to register with EDMQTT::MQTT::subscribe().
    LightAutomationStateConsumer* consumer() { return &_consumer; }

    struct Snapshot
    {
        bool enabledValid = false;
        bool enabled = false;
        bool brightnessValid = false;
        uint8_t brightness = 0;
        bool temperatureValid = false;
        uint16_t temperature = 0;
        bool colorValid = false;
        CRGB color;
    };

    const Snapshot& mainSnapshot() const { return _mainSnapshot; }
    const Snapshot& backSnapshot() const { return _backSnapshot; }

    bool nightMode() const { return _nightMode; }
    bool nightModeValid() const { return _nightModeValid; }

private:
    void snapshotLight(EDCommon::Light::Light* light, Snapshot& out);

private:
    EDCommon::Light::Light* const* _main;
    EDCommon::Light::Light* const* _back;

    LightAutomationStateConsumer _consumer;

    Snapshot _mainSnapshot;
    Snapshot _backSnapshot;

    bool _nightMode = false;
    bool _nightModeValid = false;

    int64_t _lastUpdateTime = 0;
};
