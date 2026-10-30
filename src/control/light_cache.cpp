#include <FS.h>
#include <LittleFS.h>

#include "control/light_cache.h"

void LightAutomationStateConsumer::consume(std::string payload)
{
    if (_cache == nullptr) {
        return;
    }

    if (payload == "true") {
        _cache->setNightMode(true);
    } else if (payload == "false") {
        _cache->setNightMode(false);
    }
}

void LightCache::init(const char* topicPrefix)
{
    char topic[256] = {0};
    snprintf(topic, sizeof(topic), "%s/light_automation/state", topicPrefix);
    _consumer.init(topic);
}

void LightCache::update()
{
    if ((_lastUpdateTime + 500000) >= esp_timer_get_time()) {
        return;
    }

    EDCommon::Light::Light* mainLightPtr = _main != nullptr ? *_main : nullptr;
    EDCommon::Light::Light* backLightPtr = _back != nullptr ? *_back : nullptr;

    if (mainLightPtr != nullptr) {
        snapshotLight(mainLightPtr, _mainSnapshot);
    } else {
        _mainSnapshot = Snapshot();
    }

    if (backLightPtr != nullptr) {
        snapshotLight(backLightPtr, _backSnapshot);
    } else {
        _backSnapshot = Snapshot();
    }

    _lastUpdateTime = esp_timer_get_time();
}

void LightCache::seedFromFile()
{
    if (_nightModeValid) {
        return;
    }

    File file = LittleFS.open("/light_state.bin", FILE_READ);
    if (!file) {
        return;
    }

    uint8_t nightModeByte = 0;
    if (file.read(&nightModeByte, 1) == 1) {
        _nightMode = nightModeByte != 0;
        _nightModeValid = true;
    }

    file.close();
}

void LightCache::setNightMode(bool enabled)
{
    _nightMode = enabled;
    _nightModeValid = true;
}

void LightCache::snapshotLight(EDCommon::Light::Light* light, Snapshot& out)
{
    auto enabled = light->isEnabled();
    out.enabledValid = enabled.second;
    out.enabled = enabled.first;

    auto brightness = light->getBrightness();
    out.brightnessValid = brightness.second;
    out.brightness = brightness.first;

    auto temperature = light->getTemperature();
    out.temperatureValid = temperature.second;
    out.temperature = temperature.first;

    auto color = light->getColor();
    out.colorValid = color.second;
    out.color = color.first;
}
