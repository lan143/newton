#include <Utils.h>

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

    _state = _configMgr->getConfig().lightState;
    if (_state.enabled) {
        _manual = true;
    }

    update();
}

void LightAutomation::changeState(bool enabled)
{
    changeStateInternal(enabled, enabled ? false : true); // we enable manual mode only when light disabled by switch or mqtt
}

void LightAutomation::setColor(CRGB color)
{
    _state.color = color;
    update();
}

void LightAutomation::setBrightness(uint8_t brightness)
{
    _state.brightness = brightness;
    update();
}

void LightAutomation::setColorTemperature(uint16_t temperature)
{
    _state.temperature = temperature;
    update();
}

void LightAutomation::changeNightModeState(bool enabled)
{
    _state.nightMode = enabled;
    update();
    _stateMgr->getState().setLightNightModeState(enabled);
}

void LightAutomation::changeStateInternal(bool enabled, bool manual)
{
    if (_state.enabled == enabled) {
        return;
    }

    _state.enabled = enabled;
    _manual = manual;

    if (_manual) {
        _lastManualControlTime = millis();
    }

    update();
}

void LightAutomation::loop()
{
    if ((_lastCheckTime + 500) < millis()) {
        auto isEnabled = _main->isEnabled();
        auto brightness = _main->getBrightness();

        if (isEnabled._success && _state.enabled != isEnabled._value) {
            changeStateInternal(isEnabled._value, true);
        }

        if (brightness._success && _state.brightness != brightness._value && !_state.nightMode) { // skip change brightness in night mode
            setBrightness(brightness._value);
        }

        // enable light if human detected, manual mode isnt active and light level < 200 lx
        if (_stateMgr->getState().isHumanDetected1().Valid() && _stateMgr->getState().getLightLevel().Valid()) {
            if (_stateMgr->getState().isHumanDetected1().Value() && !_manual) {
                if (_stateMgr->getState().getLightLevel().Value() < 200.0f) {
                    changeStateInternal(true, false);
                }
            } else {
                changeStateInternal(false, false);
            }
        }

        _lastCheckTime = millis();
    }

    // disable manual mode after 1 hour last manual action
    if (_manual && (_lastManualControlTime + 3600000) < millis()) {
        _manual = false;
    }

    if ((_lastStateUpdateTime + 60000) < millis()) {
        if (_configMgr->getConfig().lightState.enabled != _state.enabled
            || _configMgr->getConfig().lightState.nightMode != _state.nightMode
            || _configMgr->getConfig().lightState.brightness != _state.brightness
            || _configMgr->getConfig().lightState.color != _state.color
            || _configMgr->getConfig().lightState.temperature != _state.temperature
        ) {
            _configMgr->getConfig().lightState = _state;
            _configMgr->store();
        }

        _lastStateUpdateTime = millis();
    }
}

void LightAutomation::update()
{
    // temporary commented while backlight isnt installed
    //_main->setEnabled(!_state.nightMode ? _state.enabled : false);
    _main->setEnabled(_state.enabled);
    _backlight->setEnabled(_state.enabled);

    if (_state.enabled) {
        if (_state.nightMode) {
            _backlight->setColor(0xff0000);
            _backlight->setBrightness(10); // 10% of max

            // temporary while backlight isnt installed
            _main->setColorTemperature(2700);
            _main->setBrightness(5); // 5% of max
        } else {
            _main->setColorTemperature(_state.temperature);
            _main->setBrightness(_state.brightness);

            _backlight->setColor(_state.color);
            _backlight->setBrightness(_state.brightness);
        }
    }

    _stateMgr->getState().setLightSwitchState(_state.enabled);
    _stateMgr->getState().setLightBrightness(_state.brightness);
    _stateMgr->getState().setLightColor(_state.color);
    _stateMgr->getState().setLightTempColor(_state.temperature);
}
