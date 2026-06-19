import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import itemsDb from "../data/items.json";
import "./styles.css";

const dict = {
  zh: {
    title: "帆船赛事准备清单",
    tool: "赛事工具",
    menu: "菜单",
    export: "导出 Excel",
    close: "关闭",
    info: "说明",
    language: "语言",
    about: "About",
    sponsorTitle: "鸣谢 SurgeSails",
    sponsorText: "SurgeSails 赞助本项目。SurgeSails 提供在线帆型配置、实时价格和制帆师复核流程，帮助船东更清楚地准备和订购帆。",
    sponsorLink: "访问 SurgeSails.com",
    config: "赛事配置",
    basics: "基础",
    options: "选项",
    result: "生成结果",
    totalTable: "按大类清单",
    packingTable: "按船装箱清单",
    classes: "级别",
    singleMarks: "单标",
    gateMarks: "门标",
    juryBoats: "仲裁船",
    needGps: "GPS",
    separateFinish: "独立终点",
    shore: "岸上信号",
    cFlag: "C 旗",
    orSignals: "O/R 信号",
    juryRule42: "规则 42",
    onWater: "水上仲裁",
    groupBy: "分组",
    byCategory: "按大类",
    byStation: "按船只",
    totalNote: "按物资类型汇总，适合采购和总量核对。",
    packingNote: "按岗位装箱，适合现场分发。",
    columns: {
      group: "大类",
      station: "岗位",
      name: "物品",
      qty: "数",
      unit: "单位",
      purpose: "用途",
      preparation: "准备说明"
    },
    stations: {
      start: "起航船",
      pin: "起点左侧船",
      finish: "终点船",
      mark: "标艇",
      jury: "仲裁船",
      shore: "岸上信号区",
      allRc: "所有竞委会船",
      allBoats: "所有工作船",
      classSignals: "起航船/终点船/岸上",
      markSystem: "浮标系统",
      flagGear: "旗具配置"
    },
    optionHelp: {
      separateFinish: "勾选后生成独立终点船、终点标和终点船蓝旗等物资；不勾选时，起航船和左侧船各准备一面蓝旗，便于临时承担终点线。",
      includeShore: "勾选后生成岸上信号区所需旗帜、信号杆、公告板和岸上对讲机。",
      needGps: "勾选后为竞委会船生成 GPS；不勾选时默认可使用手机定位系统替代。",
      cFlag: "勾选后为标艇生成 C 旗及红/绿方向、加/减长度信号，用于改变下一航段。",
      orSignals: "勾选后生成 O 旗、R 旗，适用于需要 O/R 信号的级别或航行细则。",
      juryRule42: "勾选后为仲裁船生成规则 42 黄色手旗。是否使用取决于级别规则和航行细则。",
      onWaterJudging: "勾选后为每条仲裁船生成红、黑、绿白手旗，用于水上仲裁。"
    }
  },
  en: {
    title: "Sailing Event Prep List",
    tool: "Race tool",
    menu: "Menu",
    export: "Export Excel",
    close: "Close",
    info: "Info",
    language: "Language",
    about: "About",
    sponsorTitle: "Thanks to SurgeSails",
    sponsorText: "This project is sponsored by SurgeSails. SurgeSails provides online sail configuration, live pricing, and sailmaker review before production.",
    sponsorLink: "Visit SurgeSails.com",
    config: "Event setup",
    basics: "Basics",
    options: "Options",
    result: "Generated result",
    totalTable: "Master equipment list",
    packingTable: "Boat packing list",
    classes: "Classes",
    singleMarks: "Single",
    gateMarks: "Gates",
    juryBoats: "Jury boats",
    needGps: "GPS",
    separateFinish: "Separate finish",
    shore: "Shore signals",
    cFlag: "Flag C",
    orSignals: "O/R signals",
    juryRule42: "Rule 42",
    onWater: "On-water jury",
    groupBy: "Group",
    byCategory: "By category",
    byStation: "By boat",
    totalNote: "Grouped by equipment type for procurement and total checks.",
    packingNote: "Grouped by boat or station for on-site packing.",
    columns: {
      group: "Group",
      station: "Station",
      name: "Item",
      qty: "Qty",
      unit: "Unit",
      purpose: "Purpose",
      preparation: "Preparation"
    },
    stations: {
      start: "Starting vessel",
      pin: "Start pin-end vessel",
      finish: "Finishing vessel",
      mark: "Mark boats",
      jury: "Jury boats",
      shore: "Shore signal area",
      allRc: "All RC boats",
      allBoats: "All working boats",
      classSignals: "Start / finish / shore",
      markSystem: "Mark system",
      flagGear: "Flag gear"
    },
    optionHelp: {
      separateFinish: "Adds a separate finish vessel, finish mark, blue flag, and finish equipment. When off, the start vessel and pin-end vessel each carry one blue flag for possible finish duty.",
      includeShore: "Adds shore signal flags, signal mast gear, notice board, and shore radio.",
      needGps: "Adds GPS units for RC boats. When off, phone positioning can be used instead.",
      cFlag: "Adds flag C plus red/green direction and plus/minus length signals for course changes.",
      orSignals: "Adds O and R flags where required by class rules or sailing instructions.",
      juryRule42: "Adds yellow Rule 42 hand flags to jury boats where applicable.",
      onWaterJudging: "Adds red, black, and green-white hand flags to each jury boat."
    }
  }
};

const initialConfig = {
  classCount: 1,
  singleMarks: 2,
  gateMarks: 1,
  juryBoats: 1,
  needGps: false,
  separateFinish: true,
  includeShore: true,
  cFlag: false,
  orSignals: false,
  juryRule42: false,
  onWaterJudging: true
};

function local(value, lang) {
  if (typeof value === "string") return value;
  return value?.[lang] ?? value?.zh ?? value?.en ?? "";
}

function itemById(id) {
  return itemsDb.items.find((item) => item.id === id);
}

function categoryName(id, lang) {
  const category = itemsDb.categories.find((entry) => entry.id === id);
  return local(category, lang);
}

function itemDetails(id, lang) {
  const zh = lang === "zh";
  if (id.startsWith("flag_")) {
    if (id.includes("_hand") || id === "flag_red_jury" || id === "flag_green_white" || id === "flag_yellow_rule42") {
      return zh ? "仲裁船手旗：含短旗杆，小一号，仲裁员手持" : "Jury boat hand flag: includes short pole, smaller size, held by umpire";
    }
    if (id === "flag_pole") return zh ? "备用长旗杆；通常已随旗配置" : "Spare long pole; normally included with each flag";
    if (id === "flag_socket") return zh ? "起航船 6 个；其他工作船每船 2 个，用于固定身份旗和信号旗" : "6 on the starting vessel; 2 on each other working boat for identity and signal flags";
    if (id === "flag_rc" || id === "flag_j") return zh ? "身份旗：含旗杆，固定悬挂在船上" : "Identity flag: includes pole, fixed on the boat";
    return zh ? "大信号旗：含对应旗杆，按岗位展示" : "Large signal flag: includes pole, displayed by station";
  }
  if (id.startsWith("mark_")) return zh ? "随浮标系统装箱" : "Pack with the mark system";
  return "";
}

function normalizeConfig(values) {
  const classCount = Math.max(1, Number(values.classCount || 1));
  return {
    ...values,
    classCount,
    classesList: Array.from({ length: classCount }, (_, index) => `Class ${index + 1}`),
    singleMarks: Number(values.singleMarks || 0),
    gateMarks: Number(values.gateMarks || 0),
    juryBoats: Number(values.juryBoats || 0)
  };
}

function classPreparation(config, lang) {
  return lang === "zh"
    ? `按 ${config.classCount} 个级别准备。起航船必须有，终点船和岸上信号区按需要准备。`
    : `Prepare for ${config.classCount} class(es). Required on the starting vessel; prepare for finish and shore as needed.`;
}

function makeAccumulator(lang) {
  const map = new Map();
  const order = itemsDb.categories.map((category) => category.id);

  function add(id, qty, stationKey, preparation = "", details = "") {
    if (!qty) return;
    const source = itemById(id);
    if (!source) throw new Error(`Unknown item id: ${id}`);
    const rowDetails = details || itemDetails(id, lang);
    const rowPreparation = preparation || local(source.preparation ?? source.requirement, lang);
    const fullPreparation = [rowDetails, rowPreparation].filter(Boolean).join(lang === "zh" ? "；" : "; ");
    const key = `${id}::${stationKey}::${fullPreparation}`;
    const old = map.get(key);
    if (old) {
      old.qty += qty;
      return;
    }
    map.set(key, {
      key,
      id,
      categoryId: source.category,
      category: categoryName(source.category, lang),
      stationKey,
      station: dict[lang].stations[stationKey] ?? stationKey,
      name: local(source.name, lang),
      qty,
      unit: local(source.unit, lang),
      purpose: local(source.purpose, lang),
      preparation: fullPreparation
    });
  }

  function rows(sortBy = "category") {
    return [...map.values()].sort((a, b) => {
      if (sortBy === "station") {
        const station = a.station.localeCompare(b.station, lang === "zh" ? "zh-Hans-CN" : "en");
        if (station) return station;
      }
      const group = order.indexOf(a.categoryId) - order.indexOf(b.categoryId);
      if (group) return group;
      return a.name.localeCompare(b.name, lang === "zh" ? "zh-Hans-CN" : "en");
    });
  }

  return { add, rows };
}

function statsFromConfig(config) {
  const finishBoats = config.separateFinish ? 1 : 0;
  const markBoats = config.singleMarks + config.gateMarks;
  const rcBoats = 1 + 1 + finishBoats + markBoats;
  const workingBoats = rcBoats + config.juryBoats;
  const buoyCount = config.singleMarks + config.gateMarks * 2 + 1 + finishBoats;
  const classSignalStations = 1 + finishBoats + (config.includeShore ? 1 : 0);
  const startFlagCount = 13 + config.classesList.length + (config.orSignals ? 2 : 0);
  const finishFlagCount = finishBoats ? 7 + config.classesList.length : 0;
  const fallbackFinishFlagCount = finishBoats ? 0 : 2;
  const markFlagCount = markBoats * (2 + (config.cFlag ? 5 : 0) + (config.orSignals ? 2 : 0));
  const shoreFlagCount = config.includeShore ? 8 + config.classesList.length : 0;
  const totalLargeFlags = startFlagCount + finishFlagCount + fallbackFinishFlagCount + markFlagCount + shoreFlagCount + rcBoats + config.juryBoats;
  return { finishBoats, markBoats, rcBoats, workingBoats, buoyCount, classSignalStations, totalLargeFlags, classCount: config.classesList.length };
}

function generateMasterRows(config, lang) {
  const acc = makeAccumulator(lang);
  const stats = statsFromConfig(config);

  addRaceSignals(acc, config, lang, "master");
  acc.add("flag_rc", stats.rcBoats, "allRc");
  acc.add("flag_j", config.juryBoats, "jury");
  acc.add("flag_socket", 6 + Math.max(0, stats.workingBoats - 1) * 2, "flagGear");
  acc.add("boat_start", 1, "start");
  acc.add("boat_start_pin", 1, "pin");
  acc.add("boat_mark", stats.markBoats, "mark");
  acc.add("boat_finish", stats.finishBoats, "finish");
  acc.add("boat_jury", config.juryBoats, "jury");
  acc.add("air_horn", 1 + stats.finishBoats + (config.includeShore ? 1 : 0), "start");
  acc.add("whistle", stats.markBoats + stats.finishBoats + config.juryBoats, "allBoats");
  acc.add("whiteboard", 1 + stats.finishBoats, "start");
  acc.add("whiteboard_marker", 2 + stats.finishBoats, "start");
  if (config.needGps) acc.add("gps", stats.rcBoats, "allRc");
  acc.add("wind_meter", Math.max(2, 1 + Math.min(stats.markBoats, 1)), "allRc");
  acc.add("wind_indicator", 1 + stats.markBoats, "allRc");
  acc.add("radio", stats.workingBoats + (config.includeShore ? 1 : 0), "allBoats");
  acc.add("clipboard", stats.workingBoats + 1, "allBoats");
  acc.add("paper", stats.workingBoats + 2, "allBoats");
  acc.add("pen", stats.workingBoats * 2 + 4, "allBoats");
  acc.add("mark_single", config.singleMarks, "markSystem");
  acc.add("mark_gate", config.gateMarks * 2, "markSystem");
  acc.add("mark_start", 1, "markSystem");
  acc.add("mark_finish", stats.finishBoats, "markSystem");
  acc.add("mark_anchor_set", stats.buoyCount, "markSystem");
  acc.add("mark_connector_set", stats.buoyCount, "markSystem");
  acc.add("boat_anchor", stats.workingBoats, "allBoats");
  acc.add("zip_ties", stats.rcBoats, "allRc");
  acc.add("tape", stats.rcBoats, "allRc");
  acc.add("knife", stats.rcBoats, "allRc");
  acc.add("storage_box", stats.workingBoats, "allBoats");
  if (config.includeShore) {
    acc.add("notice_board", 1, "shore");
    acc.add("signal_halyard", 1, "shore");
  }

  return { rows: acc.rows(), stats };
}

function generatePackingRows(config, lang) {
  const acc = makeAccumulator(lang);
  const stats = statsFromConfig(config);

  addRaceSignals(acc, config, lang, "packing");
  const rcStations = ["start", "pin", ...Array(stats.markBoats).fill("mark"), ...(stats.finishBoats ? ["finish"] : [])];
  const workingStations = [...rcStations, ...Array(config.juryBoats).fill("jury")];

  acc.add("boat_start", 1, "start");
  acc.add("boat_start_pin", 1, "pin");
  acc.add("boat_mark", stats.markBoats, "mark");
  acc.add("boat_finish", stats.finishBoats, "finish");
  acc.add("boat_jury", config.juryBoats, "jury");
  ["start", "pin", "mark", ...(stats.finishBoats ? ["finish"] : [])].forEach((station) => acc.add("flag_rc", station === "mark" ? stats.markBoats : 1, station));
  acc.add("flag_j", config.juryBoats, "jury");
  acc.add("flag_socket", 6, "start");
  acc.add("flag_socket", 2, "pin");
  acc.add("flag_socket", stats.markBoats * 2, "mark");
  acc.add("flag_socket", stats.finishBoats * 2, "finish");
  acc.add("flag_socket", config.juryBoats * 2, "jury");
  acc.add("air_horn", 1, "start");
  acc.add("air_horn", stats.finishBoats, "finish");
  acc.add("whistle", stats.markBoats, "mark");
  acc.add("whistle", stats.finishBoats, "finish");
  acc.add("whistle", config.juryBoats, "jury");
  acc.add("whiteboard", 1, "start");
  acc.add("whiteboard", stats.finishBoats, "finish");
  acc.add("whiteboard_marker", 2, "start");
  acc.add("whiteboard_marker", stats.finishBoats, "finish");
  if (config.needGps) {
    ["start", "pin", "mark", ...(stats.finishBoats ? ["finish"] : [])].forEach((station) => acc.add("gps", station === "mark" ? stats.markBoats : 1, station));
  }
  acc.add("wind_meter", 1, "start");
  acc.add("wind_meter", stats.markBoats ? 1 : 0, "mark");
  acc.add("wind_indicator", 1, "start");
  acc.add("wind_indicator", stats.markBoats, "mark");
  acc.add("radio", 1, "start");
  acc.add("radio", 1, "pin");
  acc.add("radio", stats.markBoats, "mark");
  acc.add("radio", stats.finishBoats, "finish");
  acc.add("radio", config.juryBoats, "jury");
  acc.add("clipboard", 2, "start");
  acc.add("clipboard", 1, "pin");
  acc.add("clipboard", stats.markBoats, "mark");
  acc.add("clipboard", stats.finishBoats, "finish");
  acc.add("clipboard", config.juryBoats, "jury");
  acc.add("paper", 2, "start");
  acc.add("paper", 1, "pin");
  acc.add("paper", stats.markBoats, "mark");
  acc.add("paper", stats.finishBoats, "finish");
  acc.add("paper", config.juryBoats, "jury");
  acc.add("pen", 4, "start");
  acc.add("pen", 2, "pin");
  acc.add("pen", stats.markBoats * 2, "mark");
  acc.add("pen", stats.finishBoats * 2, "finish");
  acc.add("pen", config.juryBoats * 2, "jury");
  acc.add("mark_single", config.singleMarks, "markSystem");
  acc.add("mark_gate", config.gateMarks * 2, "markSystem");
  acc.add("mark_start", 1, "markSystem");
  acc.add("mark_finish", stats.finishBoats, "markSystem");
  acc.add("mark_anchor_set", stats.buoyCount, "markSystem");
  acc.add("mark_connector_set", stats.buoyCount, "markSystem");
  workingStations.forEach((station) => acc.add("boat_anchor", 1, station));
  rcStations.forEach((station) => {
    acc.add("zip_ties", 1, station);
    acc.add("tape", 1, station);
    acc.add("knife", 1, station);
    acc.add("storage_box", 1, station);
  });
  if (config.includeShore) {
    acc.add("notice_board", 1, "shore");
    acc.add("signal_halyard", 1, "shore");
    acc.add("radio", 1, "shore");
  }
  return { rows: acc.rows("station"), stats };
}

function addRaceSignals(acc, config, lang, mode) {
  const stats = statsFromConfig(config);
  const classPrep = classPreparation(config, lang);
  const classQty = mode === "master" ? config.classesList.length * stats.classSignalStations : config.classesList.length;
  acc.add("flag_class", classQty, "start", classPrep);
  if (mode === "packing") {
    acc.add("flag_class", config.classesList.length * stats.finishBoats, "finish", classPrep);
    acc.add("flag_class", config.classesList.length * (config.includeShore ? 1 : 0), "shore", classPrep);
  }
  acc.add("flag_orange", mode === "master" ? 2 : 1, "start");
  acc.add("flag_orange", mode === "packing" ? 1 : 0, "pin");
  ["flag_p", "flag_u", "flag_black", "flag_ap", "flag_x", "flag_first_sub", "flag_l", "flag_n", "flag_s", "flag_a", "flag_h"].forEach((id) => acc.add(id, 1, "start"));
  if (stats.finishBoats) ["flag_blue", "flag_n", "flag_ap", "flag_s", "flag_a", "flag_h", "flag_b"].forEach((id) => acc.add(id, 1, "finish"));
  if (!stats.finishBoats) {
    acc.add("flag_blue", 1, "start");
    acc.add("flag_blue", 1, "pin");
  }
  acc.add("flag_m", stats.markBoats, "mark");
  acc.add("flag_s", stats.markBoats, "mark");
  if (config.cFlag) ["flag_c", "flag_red_direction", "flag_green_direction", "flag_plus", "flag_minus"].forEach((id) => acc.add(id, stats.markBoats, "mark"));
  if (config.orSignals) ["flag_o", "flag_r"].forEach((id) => acc.add(id, 1 + stats.markBoats, "mark"));
  if (config.includeShore) ["flag_ap", "flag_a", "flag_h", "flag_n", "flag_l", "flag_d", "flag_y", "flag_b"].forEach((id) => acc.add(id, 1, "shore"));
  if (config.onWaterJudging && config.juryBoats) {
    acc.add("flag_black_hand", config.juryBoats, "jury");
    acc.add("flag_red_jury", config.juryBoats, "jury");
    acc.add("flag_green_white", config.juryBoats, "jury");
  }
  if (config.juryRule42 && config.juryBoats) acc.add("flag_yellow_rule42", config.juryBoats, "jury");
}

function exportExcel(rows, labels) {
  const headers = Object.values(labels.columns);
  const html = `<html><head><meta charset="utf-8" /></head><body><table>
    <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
    <tbody>${rows
      .filter((row) => !row.isGroup)
      .map((row) => `<tr><td>${escapeHtml(row.category)}</td><td>${escapeHtml(row.station)}</td><td>${escapeHtml(row.name)}</td><td>${row.qty}</td><td>${escapeHtml(row.unit)}</td><td>${escapeHtml(row.purpose)}</td><td>${escapeHtml(row.preparation)}</td></tr>`)
      .join("")}</tbody></table></body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `sailing-equipment-${new Date().toISOString().slice(0, 10)}.xls`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function sortRowsForGroup(rows, groupBy, lang) {
  const order = itemsDb.categories.map((category) => category.id);
  return [...rows].sort((a, b) => {
    if (groupBy === "station") {
      const station = a.station.localeCompare(b.station, lang === "zh" ? "zh-Hans-CN" : "en");
      if (station) return station;
      const category = order.indexOf(a.categoryId) - order.indexOf(b.categoryId);
      if (category) return category;
    } else {
      const category = order.indexOf(a.categoryId) - order.indexOf(b.categoryId);
      if (category) return category;
      const station = a.station.localeCompare(b.station, lang === "zh" ? "zh-Hans-CN" : "en");
      if (station) return station;
    }
    return a.name.localeCompare(b.name, lang === "zh" ? "zh-Hans-CN" : "en");
  });
}

function groupedRows(rows, groupBy, lang) {
  const sorted = sortRowsForGroup(rows, groupBy, lang);
  const type = groupBy === "station" ? "station" : "category";
  const output = [];
  let current = "";
  sorted.forEach((row) => {
    const label = row[type];
    if (label !== current) {
      current = label;
      output.push({ key: `group-${type}-${output.length}-${label}`, isGroup: true, label });
    }
    output.push(row);
  });
  return output;
}

function mergeMasterRows(rows, lang) {
  const separator = lang === "zh" ? "、" : ", ";
  const map = new Map();

  rows.forEach((row) => {
    const key = [row.id, row.categoryId, row.name, row.unit, row.purpose, row.preparation].join("::");
    const current = map.get(key);
    if (current) {
      current.qty += row.qty;
      current.stationKeys.add(row.stationKey);
      current.stationNames.add(row.station);
      current.key = `${current.key}|${row.key}`;
      current.station = [...current.stationNames].join(separator);
      return;
    }
    map.set(key, {
      ...row,
      stationKeys: new Set([row.stationKey]),
      stationNames: new Set([row.station])
    });
  });

  return [...map.values()].map((row) => {
    const { stationKeys, stationNames, ...cleanRow } = row;
    return {
      ...cleanRow,
      stationKey: [...stationKeys].join("|"),
      station: [...stationNames].join(separator)
    };
  });
}

function NumberStepper({ label, value, onChange, min = 0, max = 99 }) {
  const numericValue = Number(value || 0);
  const setValue = (nextValue) => onChange(Math.min(max, Math.max(min, Number(nextValue || 0))));

  return (
    <div className="field number-field">
      <span>{label}</span>
      <div className="stepper">
        <button type="button" onClick={() => setValue(numericValue - 1)} aria-label={`${label} -`}>-</button>
        <output aria-live="polite">{numericValue}</output>
        <button type="button" onClick={() => setValue(numericValue + 1)} aria-label={`${label} +`}>+</button>
      </div>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState("zh");
  const [config, setConfig] = useState(initialConfig);
  const [groupBy, setGroupBy] = useState("station");
  const [activeFilter, setActiveFilter] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const labels = dict[lang];
  const normalized = useMemo(() => normalizeConfig(config), [config]);
  const master = useMemo(() => generateMasterRows(normalized, lang), [normalized, lang]);
  const packing = useMemo(() => generatePackingRows(normalized, lang), [normalized, lang]);
  const mergedMasterRows = useMemo(() => mergeMasterRows(master.rows, lang), [master.rows, lang]);
  const baseRows = groupBy === "station" ? packing.rows : mergedMasterRows;
  const stats = master.stats;

  const grouped = useMemo(() => {
    const map = new Map();
    for (const row of baseRows) {
      const key = groupBy === "category" ? row.categoryId : row.stationKey;
      const label = groupBy === "category" ? row.category : row.station;
      const current = map.get(key) ?? { key, label, count: 0 };
      current.count += 1;
      map.set(key, current);
    }
    return [...map.values()];
  }, [baseRows, groupBy]);

  const visibleRows = useMemo(() => {
    return baseRows.filter((row) => {
      return !activeFilter || row[activeFilter.type] === activeFilter.value;
    });
  }, [baseRows, activeFilter]);

  const tableRows = useMemo(() => groupedRows(visibleRows, groupBy, lang), [visibleRows, groupBy, lang]);

  function patchConfig(patch) {
    setConfig((old) => ({ ...old, ...patch }));
  }

  const viewTitle = groupBy === "station" ? labels.packingTable : labels.totalTable;
  const viewNote = groupBy === "station" ? labels.packingNote : labels.totalNote;
  const optionItems = [
    ["separateFinish", labels.separateFinish],
    ["includeShore", labels.shore],
    ["needGps", labels.needGps],
    ["cFlag", labels.cFlag],
    ["orSignals", labels.orSignals],
    ["juryRule42", labels.juryRule42],
    ["onWaterJudging", labels.onWater]
  ];
  return (
    <div className="app">
      <header className="topbar">
        <button className="icon-button menu-button" onClick={() => setDrawerOpen(true)} aria-label={labels.menu}>☰</button>
        <div className="brand">
          <h1>{labels.title}</h1>
        </div>
        <div className="actions">
          <select value={lang} onChange={(event) => setLang(event.target.value)}>
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
          <button className="primary" onClick={() => exportExcel(visibleRows, labels)}>{labels.export}</button>
        </div>
      </header>

      {drawerOpen && (
        <div className="drawer-layer" onClick={() => setDrawerOpen(false)}>
          <aside className="drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <strong>{labels.title}</strong>
              <button className="icon-button" onClick={() => setDrawerOpen(false)} aria-label={labels.close}>×</button>
            </div>
            <div className="drawer-controls">
              <label className="field">
                <span>{labels.language}</span>
                <select value={lang} onChange={(event) => setLang(event.target.value)}>
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
              </label>
              <button className="primary" onClick={() => exportExcel(visibleRows, labels)}>{labels.export}</button>
            </div>
            <section className="drawer-about" aria-labelledby="drawer-about-title">
              <p className="drawer-about-kicker">{labels.about}</p>
              <img src="/surgesails-logo.svg" alt="SurgeSails" />
              <h2 id="drawer-about-title">{labels.sponsorTitle}</h2>
              <p>{labels.sponsorText}</p>
              <a href="https://surgesails.com/" target="_blank" rel="noreferrer">{labels.sponsorLink}</a>
            </section>
          </aside>
        </div>
      )}

      <main className="content">
        <section className="panel config-section" id="config">
          <div className="section-title">
            <h2>{labels.config}</h2>
            <span>{labels.basics}</span>
          </div>
          <NumberStepper label={labels.classes} value={config.classCount} min={1} onChange={(value) => patchConfig({ classCount: value })} />
          <NumberStepper label={labels.singleMarks} value={config.singleMarks} onChange={(value) => patchConfig({ singleMarks: value })} />
          <NumberStepper label={labels.gateMarks} value={config.gateMarks} onChange={(value) => patchConfig({ gateMarks: value })} />
          <NumberStepper label={labels.juryBoats} value={config.juryBoats} onChange={(value) => patchConfig({ juryBoats: value })} />
          <div className="toggles">
            <div className="toggle-head">
              <strong>{labels.options}</strong>
              <button className="info-button" onClick={() => setInfoOpen(true)} aria-label={labels.info}>i</button>
            </div>
            {optionItems.map(([key, label]) => (
              <label className="check-option" key={key}>
                <input type="checkbox" checked={Boolean(config[key])} onChange={(event) => patchConfig({ [key]: event.target.checked })} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="panel results-card" id="results">
          <div className="results">
            <div className="result-summary">
              <h2>{labels.result}</h2>
            </div>
            <div className="segmented" role="group" aria-label={labels.groupBy}>
              <button className={groupBy === "station" ? "active" : ""} onClick={() => { setActiveFilter(null); setGroupBy("station"); }}>{labels.byStation}</button>
              <button className={groupBy === "category" ? "active" : ""} onClick={() => { setActiveFilter(null); setGroupBy("category"); }}>{labels.byCategory}</button>
            </div>
            <div className="stats">
              {grouped.map((entry) => (
                <button
                  className={activeFilter?.value === entry.key ? "stat active" : "stat"}
                  key={entry.key}
                  onClick={() => {
                    const type = groupBy === "category" ? "categoryId" : "stationKey";
                    setActiveFilter((old) => (old?.type === type && old.value === entry.key ? null : { type, value: entry.key }));
                  }}
                >
                  <span>{entry.label}</span>
                  <b>{entry.count}</b>
                </button>
              ))}
            </div>
          </div>
          <div className="table-head">
            <h2>{viewTitle}</h2>
            <p>{viewNote}</p>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{labels.columns.group}</th>
                  <th>{labels.columns.station}</th>
                  <th>{labels.columns.name}</th>
                  <th>{labels.columns.qty}</th>
                  <th>{labels.columns.unit}</th>
                  <th>{labels.columns.purpose}</th>
                  <th>{labels.columns.preparation}</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) =>
                  row.isGroup ? (
                    <tr className="group-row" key={row.key}>
                      <td colSpan="7">{row.label}</td>
                    </tr>
                  ) : (
                    <tr key={row.key}>
                      <td>{row.category}</td>
                      <td><span className="tag">{row.station}</span></td>
                      <td>{row.name}</td>
                      <td className="qty">{row.qty}</td>
                      <td>{row.unit}</td>
                      <td>{row.purpose}</td>
                      <td>{row.preparation}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {infoOpen && (
        <div className="modal-layer" onClick={() => setInfoOpen(false)}>
          <section className="modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="option-info-title">
            <div className="modal-head">
              <h2 id="option-info-title">{labels.info}</h2>
              <button className="icon-button" onClick={() => setInfoOpen(false)} aria-label={labels.close}>×</button>
            </div>
            <div className="info-list">
              {optionItems.map(([key, label]) => (
                <article key={key}>
                  <strong>{label}</strong>
                  <p>{labels.optionHelp[key]}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
