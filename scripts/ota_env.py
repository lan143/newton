# Inject OTA upload settings from the untracked project-root .env file.
# PlatformIO does not load .env files on its own, so this pre-script sets
# UPLOAD_PORT and UPLOAD_FLAGS before the espressif32 platform builder runs.

import os
import sys

Import("env")

REQUIRED_KEYS = ("NEWTON_OTA_IP", "NEWTON_OTA_AUTH")


def _parse_env(path):
    values = {}
    with open(path, "r", encoding="utf-8", errors="replace") as handle:
        for raw_line in handle:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().rstrip("\r")
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            values[key] = value
    return values


def _fail(message):
    sys.stderr.write(message)
    sys.stderr.flush()
    env.Exit(2)


project_dir = env.subst("$PROJECT_DIR")
env_path = os.path.join(project_dir, ".env")
targets = set(globals().get("COMMAND_LINE_TARGETS", []))
is_upload = bool({"upload", "uploadfs", "uploadfsota"} & targets)

values = {}
if os.path.isfile(env_path):
    values = _parse_env(env_path)
    ota_ip = values.get("NEWTON_OTA_IP", "")
    ota_auth = values.get("NEWTON_OTA_AUTH", "")
    if ota_ip:
        env.Replace(UPLOAD_PORT=ota_ip)
    if ota_auth:
        env.Replace(UPLOAD_FLAGS=["--auth=" + ota_auth])

if not is_upload and not env.subst("$UPLOAD_PORT"):
    # The espressif32 builder prints an OTA "upload_port missing" error even
    # for plain builds. Nothing is uploaded here, so fall back to the default
    # esptool protocol to keep plain builds quiet without a .env file.
    env.Replace(UPLOAD_PROTOCOL="esptool")

if is_upload:
    missing = [key for key in REQUIRED_KEYS if not values.get(key)]
    if not os.path.isfile(env_path) or missing:
        _fail(
            "\n"
            "OTA upload credentials are missing.\n"
            "Copy .env.example to .env in the project root and set "
            "NEWTON_OTA_IP and NEWTON_OTA_AUTH.\n"
            "The .env file is untracked; never commit it.\n"
        )
