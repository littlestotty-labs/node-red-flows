// Split the live Node-RED flows.json into per-tab exports + full copy.
// Reads /config/flows.json (the Node-RED addon's own file) and writes
// into the repository folder.
const fs = require("fs");
const path = require("path");

const SRC = "/config/flows.json";
const OUT = "/homeassistant/node_red_flows";

const TAB_FILES = {
  "Lounge": "node_red_lounge_flow.json",
  "Office": "node_red_office.json",
  "Lights": "node_red_lights_flow.json",
  "Aircon": "node_red_aircon_flow.json",
  "Bedroom": "node_red_bedroom.json",
  "Rear Garden": "node_red_rear_garden_flow.json",
  "Petrol": "node_red_petrol_flow.json",
  "Christmas Lights": "node_red_christmas_lights_flow.json",
};

const nodes = JSON.parse(fs.readFileSync(SRC, "utf8"));
const tabs = nodes.filter((n) => n.type === "tab");
const subs = nodes.filter((n) => n.type === "subflow");

for (const tab of tabs) {
  const fname = TAB_FILES[tab.label];
  if (!fname) {
    if (tab.label !== "Backup") {
      console.log(`splitter: no output file mapped for tab "${tab.label}", skipping`);
    }
    continue;
  }
  const group = [tab, ...nodes.filter((n) => n.z === tab.id)];
  fs.writeFileSync(path.join(OUT, fname), JSON.stringify(group, null, 2));
}

const subGroup = [...subs];
for (const s of subs) {
  subGroup.push(...nodes.filter((n) => n.z === s.id));
}
fs.writeFileSync(path.join(OUT, "node_red_lights_sub_flow.json"), JSON.stringify(subGroup, null, 2));

fs.writeFileSync(path.join(OUT, "node_red_all_flows.json"), JSON.stringify(nodes, null, 2));

console.log(
  `splitter: exported ${tabs.length} tabs + ${subs.length} subflows + full copy to ${OUT}`
);