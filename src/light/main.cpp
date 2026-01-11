#include "main.h"

void MainLight::init(uint8_t address)
{
    _led1 = _modbus->addLED(address);

    _led1->setMode(EDWB::LED_MODE_CCTWW);
    _led1->setInputMode(1, true);
    _led1->setSafeMode(1, EDWB::SAFE_MODE_DONT_BLOCK_INPUT);
    _led1->setInputActionRaw(1, EDWB::INPUT_TYPE_SHORT_CLICK, 0x3007); // switch cct1
    _led1->setInputActionRaw(1, EDWB::INPUT_TYPE_LONG_CLICK, 0xB008); // change cct1 brightness
}

void MainLight::setEnabled(bool enabled)
{
    _led1->enableCCT1(enabled);
}

EDUtils::Nullable<bool> MainLight::isEnabled() const
{
    auto result = _led1->isEnabledCCT1();

    return EDUtils::Nullable<bool>(result._success, result._value);
}

void MainLight::setBrightness(uint8_t brightness)
{
    _led1->setBrightnessCCT1(brightness);
}

EDUtils::Nullable<uint8_t> MainLight::getBrightness() const
{
    auto result = _led1->getBrightnessCCT1();

    return EDUtils::Nullable<uint8_t>(result._success, result._value);
}

void MainLight::setColorTemperature(uint32_t colorTemp)
{
    _led1->setTemperatureCCT1(map(colorTemp, 2700, 6000, 0, 100));
}

EDUtils::Nullable<uint32_t> MainLight::getColorTemperature() const
{
    auto result = _led1->getTemperatureCCT1();
    if (!result._success) {
        return EDUtils::Nullable<uint32_t>(false, 0);
    }

    return EDUtils::Nullable<uint32_t>(true, map(result._value, 0, 100, 2700, 6000));
}

void MainLight::switchBrightnessControl(bool enabled)
{
    if (enabled) {
        _led1->setInputActionRaw(1, EDWB::INPUT_TYPE_LONG_CLICK, 0xB008); // change cct1 brightness
    } else {
        _led1->setInputActionRaw(1, EDWB::INPUT_TYPE_LONG_CLICK, 0x0); // disable action
    }
}
