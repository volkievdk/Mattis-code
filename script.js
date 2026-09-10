const AVATARS = {
  cat: { name: "Kat", icon: "🐱", sound: "Miauw!" },
  robot: { name: "Robot", icon: "🤖", sound: "Biep!" },
  unicorn: { name: "Eenhoorn", icon: "🦄", sound: "Sparkle!" }
};

const BLOCKS = {
  up: { icon: "⬆️", label: "omhoog", code: ["omhoog()"] },
  down: { icon: "⬇️", label: "omlaag", code: ["omlaag()"] },
  left: { icon: "⬅️", label: "links", code: ["links()"] },
  right: { icon: "➡️", label: "rechts", code: ["rechts()"] },
  repeatRight: { icon: "🔁➡️", label: "4x rechts", kind: "smart", code: ["rechts()", "rechts()", "rechts()", "rechts()"] },
  repeatDown: { icon: "🔁⬇️", label: "4x omlaag", kind: "smart", code: ["omlaag()", "omlaag()", "omlaag()", "omlaag()"] },
  talk: { icon: "🔊", label: "praat", kind: "fun", code: ["praat()"] },
  dance: { icon: "💃", label: "dans", kind: "fun", code: ["dans()"] },
  openDoor: { icon: "🔘?🚪", label: "open deur", kind: "smart", code: ["openDeur()"] },
  play: { icon: "▶️", label: "play", kind: "play", code: [] }
};

const LEVELS = [
  {
    id: 1, icon: "🐾", title: "Volgorde", lesson: "Code gaat stap voor stap.", mission: "Breng je figuur naar de vis.",
    size: 5, maxBlocks: 8, start: { x: 0, y: 0 }, goal: { x: 4, y: 4 },
    walls: [], lava: [], water: [], stars: [], switches: [], doors: [],
    blocks: ["right", "down", "left", "up", "play"], success: "Je gaf stap voor stap opdrachten."
  },
  {
    id: 2, icon: "🔁", title: "Herhaling", lesson: "Herhaling maakt code korter.", mission: "Gebruik twee slimme blokjes.",
    size: 5, maxBlocks: 2, start: { x: 0, y: 0 }, goal: { x: 4, y: 4 },
    walls: [], lava: [], water: [], stars: [], switches: [], doors: [],
    blocks: ["repeatRight", "repeatDown", "right", "down", "play"], success: "Je maakte je programma korter."
  },
  {
    id: 3, icon: "🔥", title: "Debuggen", lesson: "Foutje? Kijk wat er gebeurt en verbeter.", mission: "Ontwijk lava en muren.",
    size: 5, maxBlocks: 8, start: { x: 0, y: 0 }, goal: { x: 4, y: 4 },
    walls: [{x:1,y:0},{x:1,y:1},{x:4,y:1},{x:1,y:3},{x:2,y:3}], lava: [{x:2,y:1},{x:4,y:2}], water: [], stars: [], switches: [], doors: [],
    blocks: ["right", "down", "left", "up", "play"], success: "Je vond een betere route. Dat is debuggen."
  },
  {
    id: 4, icon: "🎭", title: "Acties", lesson: "Code kan ook iets laten gebeuren.", mission: "Laat je figuur praten en dansen.",
    size: 5, maxBlocks: 6, start: { x: 0, y: 0 }, goal: { x: 4, y: 4 },
    walls: [], lava: [], water: [], stars: [], switches: [], doors: [], requiredActions: ["talk", "dance"],
    blocks: ["repeatRight", "repeatDown", "talk", "dance", "play"], success: "Je code maakte een klein verhaal."
  },
  {
    id: 5, icon: "⌨️", title: "Blokjes worden code", lesson: "Een plaatje kan ook een coderegel zijn.", mission: "Bouw blokjes en bekijk de code.",
    size: 5, maxBlocks: 7, start: { x: 0, y: 0 }, goal: { x: 4, y: 4 },
    walls: [], lava: [], water: [], stars: [], switches: [], doors: [],
    blocks: ["right", "down", "repeatRight", "repeatDown", "talk", "play"], success: "Je zag dat blokjes echte code kunnen worden."
  },
  {
    id: 6, icon: "💧", title: "Route plannen", lesson: "Kijk eerst naar de route.", mission: "Loop om de vijver heen.",
    size: 6, maxBlocks: 10, start: { x: 0, y: 0 }, goal: { x: 5, y: 5 },
    walls: [], lava: [], water: [{x:2,y:1},{x:3,y:1},{x:2,y:2},{x:3,y:2},{x:2,y:3},{x:3,y:3}], stars: [], switches: [], doors: [],
    blocks: ["right", "down", "left", "up", "repeatRight", "repeatDown", "play"], success: "Je plande de route om het water."
  },
  {
    id: 7, icon: "⭐", title: "Ster verzamelen", lesson: "Soms moet je eerst iets pakken.", mission: "Pak de ster en ga dan naar de vis.",
    size: 6, maxBlocks: 8, start: { x: 0, y: 0 }, goal: { x: 5, y: 5 },
    walls: [{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:1,y:3},{x:3,y:3},{x:4,y:3}], lava: [], water: [], stars: [{x:5,y:0}], switches: [], doors: [], mustCollectStars: true,
    blocks: ["right", "down", "left", "up", "repeatRight", "repeatDown", "play"], success: "Je verzamelde eerst de ster."
  },
  {
    id: 8, icon: "🧠", title: "Eindbaas simpel", lesson: "Combineer route, code en een regel.", mission: "Pak de ster, druk de knop in en open de deur.",
    size: 7, maxBlocks: 8, start: { x: 0, y: 0 }, goal: { x: 5, y: 6 },
    walls: [
      {x:5,y:0},{x:6,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:5,y:1},{x:6,y:1},
      {x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:6,y:2},{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3},{x:6,y:3},
      {x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4},{x:6,y:4},{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5},{x:6,y:5},
      {x:0,y:6},{x:1,y:6},{x:2,y:6},{x:3,y:6},{x:4,y:6},{x:6,y:6}
    ],
    lava: [], water: [], stars: [{x:4,y:0}], switches: [{x:4,y:2}], doors: [{x:5,y:2}], mustCollectStars: true, mustUseActions: ["openDoor"],
    blocks: ["repeatRight", "down", "right", "repeatDown", "openDoor", "talk", "play"], success: "Je combineerde alles. Jij programmeert echt."
  }
];

let childName = "";
let avatarKey = "cat";
let currentLevelIndex = 0;
let program = [];
let pos = { x: 0, y: 0 };
let codePos = { x: 0, y: 0 };
let running = false;
let codeRunning = false;
let codePanelOpen = false;
let collectedStars = new Set();
let pressedSwitch = false;
let doorOpen = false;
let actionsUsed = new Set();

const $ = (id) => document.getElementById(id);
const screens = {
  start: $("startScreen"),
  learn: $("learnScreen"),
  levels: $("levelScreen"),
  game: $("gameScreen"),
  code: $("codeScreen")
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function getAvatar() { return AVATARS[avatarKey]; }
function getLevel() { return LEVELS[currentLevelIndex]; }

function readName() {
  childName = $("childName").value.trim().replace(/\s+/g, " ");
  updatePersonalText();
  return childName;
}

function requireName() {
  readName();
  const card = document.querySelector(".name-hero-card");
  if (!childName) {
    card.classList.add("needs-name");
    $("nameHelper").textContent = "Typ eerst je naam. Dan kan de app tegen jou praten.";
    $("childName").focus();
    return false;
  }
  card.classList.remove("needs-name");
  $("nameHelper").textContent = `Hoi ${childName}. Kies wat je wilt doen.`;
  return true;
}

function updatePersonalText() {
  const name = childName || "programmeur";
  $("learnTitle").textContent = `${name}, zo werkt code`;
  $("learnIntro").textContent = `${name}, de computer leest jouw plan van boven naar beneden.`;
  $("levelTitle").textContent = `${name}, kies een level`;
  $("summaryName").textContent = `${name} als ${getAvatar().name}`;
  $("summaryAvatar").textContent = getAvatar().icon;
  $("codeLabTitle").textContent = `${name}, schrijf je eerste code`;
}

function init() {
  renderLevelCards();
  bindEvents();
  resetCodeLab();
}

function bindEvents() {
  $("childName").addEventListener("input", () => {
    readName();
    document.querySelector(".name-hero-card").classList.remove("needs-name");
    $("nameHelper").textContent = childName ? `Hoi ${childName}. Kies wat je wilt doen.` : "Dan kan Mattís Code jou persoonlijk uitleg geven.";
  });

  $("childName").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && requireName()) showScreen("levels");
  });

  $("startBlocks").addEventListener("click", () => { if (requireName()) showScreen("levels"); });
  $("startCode").addEventListener("click", () => { if (requireName()) openCodeLab(); });
  $("startLearn").addEventListener("click", () => { if (requireName()) showScreen("learn"); });
  $("learnToCode").addEventListener("click", () => { if (requireName()) openCodeLab(); });
  $("readLesson").addEventListener("click", speakCodingExplanation);
  $("stopLesson").addEventListener("click", stopSpeaking);
  $("levelExplain").addEventListener("click", () => showScreen("learn"));
  $("resetGame").addEventListener("click", resetGame);
  $("clearBlocks").addEventListener("click", clearProgram);
  $("toggleCodeView").addEventListener("click", () => {
    codePanelOpen = !codePanelOpen;
    renderProgram();
  });
  $("sendToCodeLab").addEventListener("click", sendProgramToCodeLab);
  $("nextLevel").addEventListener("click", nextLevel);
  $("resetCode").addEventListener("click", resetCodeLab);
  $("runCode").addEventListener("click", runCode);
  $("exampleCode").addEventListener("click", insertExampleCode);
  $("codeHelp").addEventListener("click", speakCodingExplanation);
  $("codeEditor").addEventListener("input", updateLineCounter);

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.go));
  });

  document.querySelectorAll(".avatar-button").forEach((button) => {
    button.addEventListener("click", () => {
      avatarKey = button.dataset.avatar;
      document.querySelectorAll(".avatar-button").forEach((node) => node.classList.remove("selected"));
      button.classList.add("selected");
      $("avatarName").textContent = getAvatar().name;
      updatePersonalText();
      updateHeroPieces();
    });
  });

  document.querySelectorAll("[data-code]").forEach((button) => {
    button.addEventListener("click", () => insertCodeLine(button.dataset.code));
  });
}

function renderLevelCards() {
  const wrapper = $("levelCards");
  wrapper.innerHTML = "";
  LEVELS.forEach((level, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "level-card";
    card.innerHTML = `<span class="level-icon">${level.icon}</span><strong>Level ${level.id}: ${level.title}</strong><span>${level.lesson}</span>`;
    card.addEventListener("click", () => loadLevel(index));
    wrapper.appendChild(card);
  });
}

function loadLevel(index) {
  currentLevelIndex = index;
  const level = getLevel();
  $("gameEyebrow").textContent = `Level ${level.id}`;
  $("gameTitle").textContent = level.title;
  $("missionText").textContent = level.mission;
  program = [];
  codePanelOpen = level.id === 5;
  resetGameState();
  renderGrid();
  renderPalette();
  renderProgram();
  updateHeroPieces();
  hideGameFeedback();
  showScreen("game");
}

function renderPalette() {
  const palette = $("blockPalette");
  palette.innerHTML = "";
  getLevel().blocks.forEach((blockName) => {
    const block = BLOCKS[blockName];
    const button = document.createElement("button");
    button.type = "button";
    button.className = block.kind || "";
    button.innerHTML = `<span>${block.icon}</span>${block.label}`;
    button.addEventListener("click", () => blockName === "play" ? playProgram() : addBlock(blockName));
    palette.appendChild(button);
  });
}

function addBlock(blockName) {
  if (running) return;
  hideGameFeedback();
  if (program.length >= getLevel().maxBlocks) {
    showGameFeedback("warning", "Vol", "Druk op play of maak leeg.");
    return;
  }
  program.push(blockName);
  renderProgram();
}

function clearProgram() {
  if (running) return;
  program = [];
  renderProgram();
  hideGameFeedback();
}

function renderProgram() {
  $("blockCounter").textContent = `${program.length}/${getLevel().maxBlocks}`;
  const tray = $("programTray");
  tray.innerHTML = "";
  if (!program.length) {
    tray.innerHTML = `<span class="empty-state">Tik blokjes.</span>`;
  } else {
    program.forEach((blockName) => {
      const step = document.createElement("span");
      step.className = "program-step";
      step.textContent = BLOCKS[blockName].icon;
      tray.appendChild(step);
    });
  }
  const generated = programToCode(program);
  $("generatedCode").textContent = generated || "// nog geen blokjes";
  $("generatedCodePanel").classList.toggle("hidden", !codePanelOpen && program.length === 0);
  $("generatedCodePanel").classList.toggle("hidden", !codePanelOpen);
}

function programToCode(items) {
  return items.flatMap((item) => BLOCKS[item]?.code || []).join("\n");
}

function sendProgramToCodeLab() {
  const code = programToCode(program);
  if (!code) {
    showGameFeedback("warning", "Nog geen code", "Maak eerst een paar blokjes.");
    return;
  }
  $("codeEditor").value = code;
  openCodeLab();
}

function resetGameState() {
  const level = getLevel();
  pos = { ...level.start };
  collectedStars = new Set();
  pressedSwitch = false;
  doorOpen = false;
  actionsUsed = new Set();
  updateHeroPieces();
}

function renderGrid() {
  const level = getLevel();
  const grid = $("gameGrid");
  grid.style.setProperty("--cell", `${100 / level.size}%`);
  grid.querySelectorAll(".cell").forEach((cell) => cell.remove());

  for (let y = 0; y < level.size; y++) {
    for (let x = 0; x < level.size; x++) {
      const cell = document.createElement("div");
      cell.className = `cell ${tileClass(level, x, y)}`;
      cell.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
      grid.appendChild(cell);
    }
  }
  placeGoal($("gameGoal"), level.goal.x, level.goal.y);
}

function tileClass(level, x, y) {
  if (has(level.walls, x, y)) return "wall";
  if (has(level.lava, x, y)) return "lava";
  if (has(level.water, x, y)) return "water";
  if (has(level.stars, x, y) && !collectedStars.has(key(x, y))) return "star";
  if (has(level.switches, x, y)) return "switch";
  if (has(level.doors, x, y) && !doorOpen) return "door";
  return "path";
}

async function playProgram() {
  if (running || !program.length) return;
  running = true;
  hideGameFeedback();
  resetGameState();
  renderGrid();
  await wait(140);

  for (const blockName of program) {
    if (gameWon()) break;
    await runBlock(blockName);
    if (await checkDanger()) return;
    await applyTileEffects();
    if (gameWon()) break;
  }

  finishOrCoach();
  running = false;
}

async function runBlock(blockName) {
  if (blockName === "repeatRight") return repeatMove("right");
  if (blockName === "repeatDown") return repeatMove("down");
  if (blockName === "talk") return talk($("gameBubble"));
  if (blockName === "dance") return dance($("gameHero"));
  if (blockName === "openDoor") return openDoorAction();
  move(blockName, pos, getLevel(), updateHeroPieces);
  await wait(270);
}

async function repeatMove(direction) {
  for (let i = 0; i < 4; i++) {
    if (gameWon()) return;
    move(direction, pos, getLevel(), updateHeroPieces);
    await wait(230);
    if (await checkDanger()) return;
    await applyTileEffects();
  }
}

async function openDoorAction() {
  actionsUsed.add("openDoor");
  if (pressedSwitch) {
    doorOpen = true;
    renderGrid();
    await say($("gameBubble"), "Deur open!");
  } else {
    await say($("gameBubble"), "Eerst knop!");
  }
}

function move(direction, position, level, onUpdate) {
  const next = { ...position };
  if (direction === "up") next.y -= 1;
  if (direction === "down") next.y += 1;
  if (direction === "left") next.x -= 1;
  if (direction === "right") next.x += 1;
  if (blocked(next, level)) {
    bump(position === pos ? $("gameHero") : $("codeHero"), position.x, position.y);
    return;
  }
  position.x = next.x;
  position.y = next.y;
  onUpdate();
}

function blocked(point, level) {
  return point.x < 0 || point.y < 0 || point.x >= level.size || point.y >= level.size || has(level.walls, point.x, point.y) || (has(level.doors, point.x, point.y) && !doorOpen);
}

async function checkDanger() {
  const level = getLevel();
  if (has(level.lava, pos.x, pos.y)) {
    showGameFeedback("fail", "Oeps", "Lava! Probeer een andere route.");
    resetGameState();
    renderGrid();
    running = false;
    return true;
  }
  if (has(level.water, pos.x, pos.y)) {
    showGameFeedback("warning", "Plons", "Kijk wat er gebeurde. Verander één blokje.");
    resetGameState();
    renderGrid();
    running = false;
    return true;
  }
  return false;
}

async function applyTileEffects() {
  const level = getLevel();
  if (has(level.stars, pos.x, pos.y) && !collectedStars.has(key(pos.x, pos.y))) {
    collectedStars.add(key(pos.x, pos.y));
    renderGrid();
    await say($("gameBubble"), "Ster!");
  }
  if (has(level.switches, pos.x, pos.y) && !pressedSwitch) {
    pressedSwitch = true;
    await say($("gameBubble"), "Klik!");
  }
}

function finishOrCoach() {
  const level = getLevel();
  if (!gameWon()) {
    showGameFeedback("warning", "Bijna", "Nog niet bij de vis. Verander één stukje.");
    return;
  }
  if (level.requiredActions && level.requiredActions.some((action) => !actionsUsed.has(action))) {
    showGameFeedback("warning", "Nog iets", "Gebruik ook praat en dans.");
    return;
  }
  if (level.mustCollectStars && collectedStars.size < level.stars.length) {
    showGameFeedback("warning", "Ster vergeten", "Pak eerst de ster, dan de vis.");
    return;
  }
  if (level.mustUseActions && level.mustUseActions.some((action) => !actionsUsed.has(action))) {
    showGameFeedback("warning", "Regel vergeten", "Gebruik ook open deur.");
    return;
  }
  showGameFeedback("success", "Gelukt!", `Goed gedaan ${childName}. ${level.success}`);
}

function gameWon() {
  const goal = getLevel().goal;
  return pos.x === goal.x && pos.y === goal.y;
}

function nextLevel() {
  const next = currentLevelIndex + 1;
  if (next < LEVELS.length) loadLevel(next);
  else showScreen("levels");
}

function showGameFeedback(type, title, text) {
  const card = $("gameFeedback");
  card.className = `feedback-card ${type}`;
  $("feedbackTitle").textContent = title;
  $("feedbackText").textContent = text;
}

function hideGameFeedback() { $("gameFeedback").className = "feedback-card hidden"; }

function updateHeroPieces() {
  const level = getLevel();
  if ($("gameGrid")) $("gameGrid").style.setProperty("--cell", `${100 / level.size}%`);
  $("gameHero").textContent = getAvatar().icon;
  $("gameHero").style.transform = `translate(${pos.x * 100}%, ${pos.y * 100}%)`;
  $("gameBubble").style.transform = `translate(${pos.x * 100}%, ${pos.y * 100}%)`;
  $("codeHero").textContent = getAvatar().icon;
}

function placeGoal(node, x, y) {
  node.style.setProperty("--goal-x", `${x * 100}%`);
  node.style.setProperty("--goal-y", `${y * 100}%`);
  node.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
}

function openCodeLab() {
  updatePersonalText();
  resetCodeLab(false);
  showScreen("code");
}

function resetCodeLab(resetText = true) {
  codePos = { x: 0, y: 0 };
  doorOpen = false;
  codeRunning = false;
  if (resetText) insertExampleCode(false);
  renderCodeGrid();
  updateCodeHero();
  updateLineCounter();
  hideCodeFeedback();
}

function renderCodeGrid() {
  const grid = $("codeGrid");
  grid.style.setProperty("--cell", "20%");
  grid.querySelectorAll(".cell").forEach((cell) => cell.remove());
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const cell = document.createElement("div");
      cell.className = "cell path";
      cell.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
      grid.appendChild(cell);
    }
  }
  placeGoal($("codeGoal"), 4, 4);
}

function insertExampleCode(focus = true) {
  $("codeEditor").value = "rechts()\nrechts()\nomlaag()\nomlaag()\npraat()";
  updateLineCounter();
  if (focus) $("codeEditor").focus();
}

function insertCodeLine(line) {
  const editor = $("codeEditor");
  const value = editor.value.trimEnd();
  editor.value = value ? `${value}\n${line}` : line;
  updateLineCounter();
  editor.focus();
}

function getCodeLines() {
  return $("codeEditor").value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function updateLineCounter() {
  const count = getCodeLines().length;
  $("lineCounter").textContent = `${count}/10`;
}

function parseCode(lines) {
  const allowed = {
    "rechts()": "right",
    "links()": "left",
    "omhoog()": "up",
    "omlaag()": "down",
    "praat()": "talk",
    "dans()": "dance",
    "openDeur()": "openDoor"
  };
  if (!lines.length) return { ok: false, message: "Typ eerst een regel code." };
  if (lines.length > 10) return { ok: false, message: "Gebruik maximaal 10 regels." };
  const commands = [];
  for (let i = 0; i < lines.length; i++) {
    if (!allowed[lines[i]]) return { ok: false, message: `Regel ${i + 1} snap ik nog niet.` };
    commands.push({ raw: lines[i], command: allowed[lines[i]], line: i + 1 });
  }
  return { ok: true, commands };
}

async function runCode() {
  if (codeRunning) return;
  const parsed = parseCode(getCodeLines());
  if (!parsed.ok) {
    showCodeFeedback("warning", "Check je code", parsed.message);
    return;
  }
  codeRunning = true;
  codePos = { x: 0, y: 0 };
  updateCodeHero();
  hideCodeFeedback();
  await wait(150);
  const codeLevel = { size: 5, walls: [], doors: [], lava: [], water: [] };
  for (const item of parsed.commands) {
    $("codeCoach").textContent = `Regel ${item.line}: ${item.raw}`;
    if (codeWon()) break;
    if (item.command === "talk") await talk($("codeBubble"));
    else if (item.command === "dance") await dance($("codeHero"));
    else if (item.command === "openDoor") await say($("codeBubble"), "Deur open!");
    else {
      move(item.command, codePos, codeLevel, updateCodeHero);
      await wait(270);
    }
    if (codeWon()) break;
  }
  if (codeWon()) showCodeFeedback("success", "Gelukt!", `${childName}, je hebt echte code geschreven.`);
  else showCodeFeedback("warning", "Bijna", "Je code werkt, maar je bent nog niet bij de vis.");
  $("codeCoach").textContent = "Elke regel code doet één actie.";
  codeRunning = false;
}

function updateCodeHero() {
  $("codeHero").textContent = getAvatar().icon;
  $("codeHero").style.transform = `translate(${codePos.x * 100}%, ${codePos.y * 100}%)`;
  $("codeBubble").style.transform = `translate(${codePos.x * 100}%, ${codePos.y * 100}%)`;
}

function codeWon() { return codePos.x === 4 && codePos.y === 4; }

function showCodeFeedback(type, title, text) {
  const card = $("codeFeedback");
  card.className = `feedback-card ${type}`;
  $("codeFeedbackTitle").textContent = title;
  $("codeFeedbackText").textContent = text;
}

function hideCodeFeedback() { $("codeFeedback").className = "feedback-card hidden"; }

async function talk(bubble) {
  actionsUsed.add("talk");
  await say(bubble, getAvatar().sound);
  speakShort(getAvatar().sound);
}

async function dance(piece) {
  actionsUsed.add("dance");
  piece.classList.add("dance");
  await wait(520);
  piece.classList.remove("dance");
}

async function say(bubble, text) {
  bubble.textContent = text;
  bubble.classList.remove("hidden");
  await wait(540);
  bubble.classList.add("hidden");
}

function speakCodingExplanation() {
  if (!requireName()) return;
  const text = [
    `Hoi ${childName}. Ik leg uit hoe coderen werkt.`,
    "Code is een plan voor de computer.",
    "De computer leest jouw code van boven naar beneden.",
    "Eén regel code doet één ding.",
    "Rechts met haakjes betekent: ga één stap naar rechts.",
    "Omlaag met haakjes betekent: ga één stap omlaag.",
    "De volgorde is belangrijk.",
    "Foutjes zijn normaal.",
    "Een foutje zoeken en verbeteren heet debuggen.",
    "Probeer. Kijk. Verbeter. Programmeer."
  ].join(" ");
  speak(text, .9, 1.15);
}

function speakShort(text) { speak(text, 1.12, 1.5); }

function speak(text, rate = 1, pitch = 1.2) {
  if (!("speechSynthesis" in window)) {
    alert("Voorlezen werkt niet in deze browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "nl-NL";
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function bump(node, x, y) {
  node.animate([
    { transform: `translate(${x * 100}%, ${y * 100}%) rotate(0deg)` },
    { transform: `translate(${x * 100}%, ${y * 100}%) rotate(-8deg)` },
    { transform: `translate(${x * 100}%, ${y * 100}%) rotate(8deg)` },
    { transform: `translate(${x * 100}%, ${y * 100}%) rotate(0deg)` }
  ], { duration: 220, iterations: 1 });
}

function has(list = [], x, y) { return list.some((item) => item.x === x && item.y === y); }
function key(x, y) { return `${x},${y}`; }
function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

init();
showScreen("start");
