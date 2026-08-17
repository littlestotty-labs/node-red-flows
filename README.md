# Node-RED Flow Backups

Automated backup of the Node-RED flows running in the Home Assistant
Node-RED addon, pushed to GitHub on a schedule.

## What's in here

| File | Contents |
|------|----------|
| `node_red_all_flows.json` | Full copy of the live `flows.json` |
| `node_red_lounge_flow.json` | Lounge tab |
| `node_red_office.json` | Office tab |
| `node_red_lights_flow.json` | Lights tab |
| `node_red_lights_sub_flow.json` | Light sub-flows (Light On / Light Off) |
| `node_red_aircon_flow.json` | Aircon tab |
| `node_red_bedroom.json` | Bedroom tab |
| `node_red_rear_garden_flow.json` | Rear Garden tab |
| `node_red_petrol_flow.json` | Petrol tab |
| `node_red_christmas_lights_flow.json` | Christmas Lights tab |
| `export.sh` | The backup script (runs inside the Node-RED addon) |
| `splitter.js` | Splits `flows.json` into the per-tab files above |

## How it gets updated

A **"Backup Nodes"** flow in Node-RED triggers `export.sh`:

- **Automatically** — every Monday at 03:00
- **Manually** — by clicking the **"Run now"** inject node in the flow editor

`export.sh` reads the addon's live `/config/flows.json`, runs `splitter.js`
to regenerate the per-tab files, then commits and pushes to this repo.
Authentication uses the `github_nodered_token` entry in Home Assistant's
`secrets.yaml` (read at runtime, never stored here). If nothing changed,
no commit is made.

## Restoring a flow

Each tab file is a valid Node-RED flow export — import it from the Node-RED
editor (Hamburger menu → Import) to restore or review that flow. The full
`node_red_all_flows.json` restores everything at once.
