# RTK.md — using `rtk` with Newton

Repo-specific companion to the global RTK guide (`~/.claude/RTK.md`). The
global file explains what `rtk` is and how it saves tokens; this file only maps
Newton tasks to commands. Build output here is large (ESP32 toolchain + many
ed-* libraries), so filtering is especially useful.

## Task → command

| Task | Command |
|---|---|
| Production build, errors only | `rtk err pio run -e kc868a2` |
| Full build tail incl. RAM/Flash | `rtk summary pio run -e kc868a2` |
| Dev-name build (`Newton dev`) | `rtk err pio run -e kc868a2_dev` |
| Upload web UI to LittleFS | `rtk err pio run -e kc868a2 -t uploadfs` |
| USB firmware upload | `rtk err pio run -e kc868a2 -t upload` |
| OTA upload (target from `.env`) | `rtk err pio run -e kc868a2_ota -t upload` |
| Working tree / history | `rtk git status`, `rtk git log --oneline -10` |
| Review a change | `rtk diff` |
| Find a symbol/key | `rtk grep -rn "warmFloorSetPoint" src` |
| Find files by name | `rtk find src -name '*.h'` |
| Skim a source file | `rtk read src/config_migration.cpp` |
| Inspect a dependency API | `rtk grep -rn "changeSpeed" .pio/libdeps/kc868a2/ed-wb/src` |
| Dependency summary | `rtk deps` |
| Compact JSON payload | `rtk json` |
| Device status over HTTP | `rtk curl http://<device-ip>/api/status` |
| Count doc/code lines | `rtk wc -l AGENTS.md README.md RTK.md` |

Notes:

- `rtk err` is the default choice for builds/uploads: it keeps diagnostics and
  warnings, drops the long success chatter.
- Use `rtk summary` when you need the final memory/flash lines that `rtk err`
  omits.
- `rtk read` condenses source. For editing, read the exact file with the native
  Read tool first (the Edit tool requires a full-fidelity read).

## Finding and reading code

- Search source with `rtk grep -rn "<pattern>" src`; use `rtk rg` if you prefer
  ripgrep semantics (respects `.gitignore`, faster on `.pio`).
- Library APIs are the usual unknown: grep the checked-out dependency under
  `.pio/libdeps/kc868a2/<lib>/src`. `ed-common` is pinned to tag `0.3.1` from
  git; all checked-out sources live under `.pio/libdeps/kc868a2/<lib>/src`.
- Do not run `rtk read` on vendored minified assets
  (`data/*.min.js`, `data/*.min.css`); it is noise and can hide nothing useful.
- If filtered output omits something you need, recover it with
  `rtk recall <hash>` (the hash is printed in the truncated result) or re-run
  the raw command via `rtk proxy <cmd>`.

## Project-specific caveats

- The serial monitor is interactive: use plain `pio device monitor -e kc868a2`
  (115200 8N1). Do not pipe it through a filter.
- `pio run -e kc868a2 -t uploadfs` rewrites the LittleFS image; it does not
  build the firmware. Run the normal build/upload too when both changed.
- OTA reads the address and auth value from the untracked `.env`; never print
  or copy the auth value into logs or docs.
- Batch related reads/greps into one shell call to avoid extra turns. There is
  no test command to filter — `pio run -e kc868a2` is the only automated check.
