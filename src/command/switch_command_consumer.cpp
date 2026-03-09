#include <log/log.h>

#include "command/switch_command_consumer.h"

void SwitchCommandConsumer::consume(std::string payload)
{
    LOGD("switch_command_consumer", "handle");

    if (strcmp(payload.c_str(), "ON") == 0) {
        _light->changeState(true);
    } else {
        _light->changeState(false);
    }
}
