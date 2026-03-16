#include <Utils.h>
#include <log/log.h>

#include "light.h"

void LightAutomation::init(EDHA::Device* device, std::string stateTopic, std::string commandTopic, std::string switchCommandTopic)
{
    _discoveryMgr->addSwitch(
        device,
        "Light night mode",
        "lightNightMode",
        EDUtils::formatString("light_night_mode_newton_%s", EDUtils::getChipID())
    )
        ->setCommandTemplate("{\"lightNightMode\": {{ value }} }")
        ->setCommandTopic(commandTopic)
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.lightNightMode }}")
        ->setPayloadOn("true")
        ->setPayloadOff("false")
        ->setStateOn("true")
        ->setStateOff("false");

    _discoveryMgr->addLight(
        device,
        "Light",
        "light",
        EDUtils::formatString("light_newton_%s", EDUtils::getChipID())
    )
        ->setCommandTopic(switchCommandTopic)
        ->setStateTopic(stateTopic)
        ->setStateValueTemplate("{{ value_json.lightSwitchState }}")
        ->setPayloadOn("ON")
        ->setPayloadOff("OFF")
        ->setBrightnessCommandTopic(commandTopic)
        ->setBrightnessCommandTemplate("{\"lightBrightness\": {{ value }} }")
        ->setBrightnessStateTopic(stateTopic)
        ->setBrightnessValueTemplate("{{ value_json.lightBrightness }}")
        ->setBrightnessScale(100)
        ->setRGBCommandTopic(commandTopic)
        ->setRGBCommandTemplate("{\"lightColor\": \"{{ value }}\" }")
        ->setRGBStateTopic(stateTopic)
        ->setRGBValueTemplate("{{ value_json.lightColor }}")
        ->setColorTempKelvin(true)
        ->setColorTempCommandTemplate("{\"lightColorTemp\": {{ value }} }")
        ->setColorTempCommandTopic(commandTopic)
        ->setColorTempStateTopic(stateTopic)
        ->setColorTempValueTemplate("{{ value_json.lightColorTemp }}")
        ->setMinKelvin(2700)
        ->setMaxKelvin(6000);

    _state = _configMgr->getConfig()->lightState;
    if (_state.enabled) {
        _manual = true;
    }

    update();
}

void LightAutomation::changeState(bool enabled)
{
    changeStateInternal(enabled, true);
}

void LightAutomation::setColor(CRGB color)
{
    _state.color = color;
    update();
}

void LightAutomation::setBrightness(uint8_t brightness, bool updateLight)
{
    _state.brightness = brightness;

    if (updateLight) {
        update();
    } else {
        _stateMgr->getState().setLightBrightness(_state.brightness);
    }

    saveState();
}

void LightAutomation::setColorTemperature(uint16_t temperature)
{
    _state.temperature = temperature;

    update();
    saveState();
}

void LightAutomation::changeNightModeState(bool enabled)
{
    _state.nightMode = enabled;
    _main->switchBrightnessControl(!enabled);
    _stateMgr->getState().setLightNightModeState(enabled);

    update();
    saveState();
}

void LightAutomation::changeStateInternal(bool enabled, bool manual)
{
    if (_state.enabled == enabled) {
        return;
    }

    _state.enabled = enabled;
    _manual = manual;

    if (_manual) {
        _lastManualControlTime = esp_timer_get_time();

        saveState();
    }

    update();
}

void LightAutomation::loop()
{
    if ((_lastCheckTime + 500000) < esp_timer_get_time()) {
        auto isEnabled = _main->isEnabled();
        _backlight->setEnabled(true);
        auto brightness = _main->getBrightness();

        if (isEnabled.Valid() && _state.enabled != isEnabled.Value()) {
            LOGD("automation", "change light state from WB-LED. enabled: %s", isEnabled.Value() ? "true" : "false");
            changeStateInternal(isEnabled.Value(), true);
        }

        if (
            !_state.nightMode
            && brightness.Valid() && _state.brightness != brightness.Value()
        ) {
            LOGD("automation", "change brightness from WB-LED. brightness: %d", brightness.Value());
            setBrightness(brightness.Value(), false);
        }

        auto isHumanDetected = _stateMgr->getState().isHumanDetected1();
        if (isHumanDetected.Valid() && isHumanDetected.Value()) {
            _lastHumanDetectTime = esp_timer_get_time();
        }

        auto lightLevel = _stateMgr->getState().getLightLevel();
        if (lightLevel.Valid() && lightLevel.Value() < 150.0f) {
            lightLowLevelCount++;
        } else {
            lightLowLevelCount = 0;
        }

        // enable light if human detected, manual mode isnt active and light level is low
        if (!_manual) {
            if (isHumanDetected.Valid()) {
                if (isHumanDetected.Value() && lightLowLevelCount > 120) {
                    changeStateInternal(true, false);
                } else if (!isHumanDetected.Value()) {
                    changeStateInternal(false, false);
                }
            }
        }

        _lastCheckTime = esp_timer_get_time();
    }

    if (
        _manual
        && (
            (_state.enabled && (_lastManualControlTime + 300000000) < esp_timer_get_time()) // manual mode turns off after 5 minutes if the light was turned on manually
            || (!_state.enabled && (_lastHumanDetectTime + 600000000) < esp_timer_get_time()) // manual mode turns off 10 minutes after a person leaves the room and light is disabled
        )
    ) {
        _manual = false;
    }

    if (_needStoreState && (_lastUpdateStateTime + 10000000) < esp_timer_get_time()) {
        if (_configMgr->store()) {
            _needStoreState = false;
        } else {
            LOGE("loop", "failed to store state");
        }

        _lastUpdateStateTime = esp_timer_get_time();
    }
}

void LightAutomation::update()
{
    if (_state.nightMode) {
        _backlight->setColor(0xff0000);
        _backlight->setBrightness(10); // 10% of max

        // temporary while backlight isnt installed
        _main->setColorTemperature(2700);
        _main->setBrightness(2); // 2% of max
    } else {
        _main->setColorTemperature(_state.temperature);
        _main->setBrightness(_state.brightness);

        _backlight->setColor(_state.color);
        _backlight->setBrightness(_state.brightness);
    }

    // temporary commented while backlight isnt installed
    //_main->setEnabled(!_state.nightMode ? _state.enabled : false);
    _main->setEnabled(_state.enabled);
    _backlight->setEnabled(_state.enabled);

    _stateMgr->getState().setLightSwitchState(_state.enabled);
    _stateMgr->getState().setLightBrightness(_state.brightness);
    _stateMgr->getState().setLightColor(_state.color);
    _stateMgr->getState().setLightTempColor(_state.temperature);
}

void LightAutomation::saveState()
{
    _configMgr->getConfig()->lightState = _state;
    _needStoreState = true;
}
