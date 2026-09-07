const levels = [
  {
    label: "Level 1",
    title: "Breng je figuur naar de vis 🐟",
    lesson: "Volgorde: eerst dit, dan dat.",
    maxSteps: 8,
    start: { x: 0, y: 0 },
    fish: { x: 4, y: 4 },
    walls: [],
    lava: [],
    blocks: ["up", "down", "left", "right", "play"]
  },
  {
    label: "Level 2",
    title: "Gebruik herhaal-blokjes 🔁",
    lesson: "Herhaling: één blokje kan veel stappen doen.",
    maxSteps: 4,
    start: { x: 0, y: 0 },
    fish: { x: 4, y: 4 },
    walls: [],
    lava: [],
    blocks: ["right", "down", "repeatRight", "repeatDown", "play"]
  },
  {
    label: "Level 3",
    title: "Ontwijk de lava 🔥",
    lesson: "Debuggen: fout? Pas je code aan.",
    maxSteps: 8,
    start: { x: 0, y: 0 },
    fish: { x: 4, y: 4 },
    walls: [{x:1,y:0},{x:1,y:1},{x:4,y:1},{x:1,y:3},{x:2,y:3}],
    lava: [{x:2,y:1},{x:4,y:2}],
    blocks: ["up", "down", "left", "right", "play"]
  }
];

const blockData = {
  up: { icon: "⬆️", label: "omhoog" },
  down: { icon: "⬇️", label: "omlaag" },
  left: { icon: "⬅️", label: "links" },
  right: { icon: "➡️", label: "rechts" },
  repeatRight: { icon: "🔁➡️", label: "4x rechts", kind: "smart" },
  repeatDown: { icon: "🔁⬇️", label: "4x omlaag", kind: "smart" },
  play: { icon: "▶️", label: "play", kind: "play" }
};

let selectedAvatar = "🐱";
let selectedAvatarName = "Kat";
let currentLevelIndex = 0;
let steps = [];
let gameX = 0;
let gameY = 0;
let isGameRunning = false;

let codeX = 0;
let codeY = 0;
let isCodeRunning = false;

const $ = (id) => document.getElementById(id);
const screens = {
  home: $("homeScreen"),
  map: $("mapScreen"),
  game: $("gameScreen"),
  code: $("codeScreen")
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

$("startBlocksButton").addEventListener("click", () => showScreen("map"));
$("startCodeButton").addEventListener("click", openCodeLab);
$("codeLabButton").addEventListener("click", openCodeLab);
$("backHomeButton").addEventListener("click", () => showScreen("home"));
$("backMapButton").addEventListener("click", () => showScreen("map"));
$("backCodeButton").addEventListener("click", () => showScreen("map"));
$("resetGameButton").addEventListener("click", resetGame);
$("clearGameButton").addEventListener("click", clearGameProgram);
$("resetCodeButton").addEventListener("click", resetCodeLab);
$("exampleButton").addEventListener("click", addExampleCode);
$("runCodeButton").addEventListener("click", runTypedCode);

document.querySelectorAll("[data-level]").forEach((button) => {
  button.addEventListener("click", () => loadLevel(Number(button.dataset.level)));
});

document.querySelectorAll(".avatar").forEach((button) => {
  button.addEventListener("click", () => {
    selectedAvatar = button.dataset.avatar;
    selectedAvatarName = button.dataset.name;
    $("selectedAvatarLabel").textContent = selectedAvatarName;

    document.querySelectorAll(".avatar").forEach((avatar) => avatar.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelectorAll("[data-code]").forEach((button) => {
  button.addEventListener("click", () => insertCode(button.dataset.code));
});

$("codeEditor").addEventListener("input", updateLineCounter);

function loadLevel(index) {
  currentLevelIndex = index;
  const level = getLevel();

  $("gameLabel").textContent = level.label;
  $("gameTitle").textContent = level.title;
  $("lessonText").textContent = level.lesson;
  $("gameHero").textContent = selectedAvatar;

  renderGameBlocks();
  resetGame();
  showScreen("game");
}

function getLevel() {
  return levels[currentLevelIndex];
}

function renderGameBlocks() {
  const blocks = $("blocks");
  blocks.innerHTML = "";

  getLevel().blocks.forEach((name) => {
    const data = blockData[name];
    const button = document.createElement("button");
    button.type = "button";
    button.className = data.kind || "";
    button.innerHTML = `<span>${data.icon}</span>${data.label}`;
    button.addEventListener("click", () => {
      if (name === "play") playGameProgram();
      else addGameStep(name);
    });
    blocks.appendChild(button);
  });
}

function addGameStep(name) {
  if (isGameRunning) return;

  if (steps.length >= getLevel().maxSteps) {
    showGameMessage("warning", "Vol", "Je hebt genoeg blokjes. Druk op play of maak leeg.");
    return;
  }

  steps.push(name);
  renderGameProgram();
}

function clearGameProgram() {
  if (isGameRunning) return;
  steps = [];
  renderGameProgram();
  hideGameMessage();
}

function renderGameProgram() {
  $("stepCounter").textContent = `${steps.length}/${getLevel().maxSteps}`;
  const program = $("program");
  program.innerHTML = "";

  if (steps.length === 0) {
    const empty = document.createElement("span");
    empty.className = "empty";
    empty.textContent = "Tik blokjes hieronder.";
    program.appendChild(empty);
    return;
  }

  steps.forEach((name) => {
    const step = document.createElement("span");
    step.className = "step";
    step.textContent = blockData[name].icon;
    program.appendChild(step);
  });
}

function drawGameGrid() {
  const grid = $("gameGrid");
  grid.querySelectorAll(".cell").forEach((cell) => cell.remove());

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const cell = document.createElement("div");
      cell.className = `cell ${getGameTileClass(x, y)}`;
      cell.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
      grid.appendChild(cell);
    }
  }

  $("gameFish").style.setProperty("--fish-x", `${getLevel().fish.x * 100}%`);
  $("gameFish").style.setProperty("--fish-y", `${getLevel().fish.y * 100}%`);
  $("gameFish").style.transform = `translate(${getLevel().fish.x * 100}%, ${getLevel().fish.y * 100}%)`;
}

function getGameTileClass(x, y) {
  const level = getLevel();

  if (has(level.walls, x, y)) return "wall";
  if (has(level.lava, x, y)) return "lava";

  return "path";
}

async function playGameProgram() {
  if (isGameRunning || steps.length === 0) return;

  isGameRunning = true;
  hideGameMessage();
  resetGameHero();

  await wait(200);

  for (const step of steps) {
    if (hasGameWon()) break;

    if (step === "repeatRight") await repeatGameMove("right");
    else if (step === "repeatDown") await repeatGameMove("down");
    else {
      moveGameHero(step);
      await wait(330);
    }

    if (has(getLevel().lava, gameX, gameY)) {
      showGameMessage("fail", "Oeps", "Lava! Probeer opnieuw.");
      steps = [];
      renderGameProgram();
      resetGameHero();
      isGameRunning = false;
      return;
    }

    if (hasGameWon()) break;
  }

  if (hasGameWon()) showGameMessage("success", "Gelukt!", "Je programma werkt.");
  else showGameMessage("warning", "Bijna", "Nog niet bij de vis. Verbeter je code.");

  isGameRunning = false;
}

async function repeatGameMove(direction) {
  for (let i = 0; i < 4; i++) {
    if (hasGameWon()) return;
    moveGameHero(direction);
    await wait(270);
  }
}

function moveGameHero(direction) {
  const next = { x: gameX, y: gameY };

  if (direction === "up") next.y--;
  if (direction === "down") next.y++;
  if (direction === "left") next.x--;
  if (direction === "right") next.x++;

  if (next.x < 0 || next.y < 0 || next.x > 4 || next.y > 4 || has(getLevel().walls, next.x, next.y)) {
    bump($("gameHero"), gameX, gameY);
    return;
  }

  gameX = next.x;
  gameY = next.y;
  updateGameHero();
}

function resetGame() {
  steps = [];
  renderGameProgram();
  hideGameMessage();
  drawGameGrid();
  resetGameHero();
}

function resetGameHero() {
  gameX = getLevel().start.x;
  gameY = getLevel().start.y;
  updateGameHero();
}

function updateGameHero() {
  $("gameHero").style.transform = `translate(${gameX * 100}%, ${gameY * 100}%)`;
  $("gameBubble").style.transform = `translate(${gameX * 100}%, ${gameY * 100}%)`;
}

function hasGameWon() {
  return gameX === getLevel().fish.x && gameY === getLevel().fish.y;
}

function showGameMessage(type, title, text) {
  const message = $("gameMessage");
  message.className = `message ${type}`;
  $("gameMessageTitle").textContent = title;
  $("gameMessageText").textContent = text;
}

function hideGameMessage() {
  $("gameMessage").className = "message hidden";
}

function openCodeLab() {
  $("codeHero").textContent = selectedAvatar;
  resetCodeLab();
  showScreen("code");
}

function resetCodeLab() {
  codeX = 0;
  codeY = 0;
  isCodeRunning = false;
  hideCodeMessage();
  hideBubble($("codeBubble"));
  drawCodeGrid();
  updateCodeHero();
  updateLineCounter();
}

function drawCodeGrid() {
  const grid = $("codeGrid");
  grid.querySelectorAll(".cell").forEach((cell) => cell.remove());

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const cell = document.createElement("div");
      cell.className = "cell path";
      cell.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
      grid.appendChild(cell);
    }
  }

  $("codeFish").style.setProperty("--fish-x", "400%");
  $("codeFish").style.setProperty("--fish-y", "400%");
  $("codeFish").style.transform = "translate(400%, 400%)";
}

function addExampleCode() {
  $("codeEditor").value = "rechts()\nrechts()\nomlaag()\nomlaag()\npraat()";
  updateLineCounter();
  $("codeEditor").focus();
}

function insertCode(command) {
  const editor = $("codeEditor");
  const value = editor.value.trimEnd();

  editor.value = value ? `${value}\n${command}` : command;
  updateLineCounter();
  editor.focus();
}

function getCodeLines() {
  return $("codeEditor").value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function updateLineCounter() {
  $("lineCounter").textContent = `${getCodeLines().length}/10`;
}

async function runTypedCode() {
  if (isCodeRunning) return;

  const parsed = parseCode(getCodeLines());

  if (!parsed.ok) {
    showCodeMessage("warning", "Check je code", parsed.message);
    return;
  }

  isCodeRunning = true;
  codeX = 0;
  codeY = 0;
  hideCodeMessage();
  hideBubble($("codeBubble"));
  updateCodeHero();

  await wait(180);

  for (const command of parsed.commands) {
    if (hasCodeWon()) break;

    if (command === "praat") await talk($("codeBubble"));
    else if (command === "dans") await dance($("codeHero"));
    else {
      moveCodeHero(command);
      await wait(330);
    }

    if (hasCodeWon()) break;
  }

  if (hasCodeWon()) showCodeMessage("success", "Gelukt!", "Je hebt echte code geschreven.");
  else showCodeMessage("warning", "Bijna", "Je code werkt, maar je bent nog niet bij de vis.");

  isCodeRunning = false;
}

function parseCode(lines) {
  const allowed = {
    "rechts()": "right",
    "links()": "left",
    "omhoog()": "up",
    "omlaag()": "down",
    "praat()": "praat",
    "dans()": "dans"
  };

  if (lines.length === 0) {
    return { ok: false, message: "Typ eerst een regel code." };
  }

  if (lines.length > 10) {
    return { ok: false, message: "Gebruik maximaal 10 regels." };
  }

  const commands = [];

  for (let i = 0; i < lines.length; i++) {
    if (!allowed[lines[i]]) {
      return { ok: false, message: `Regel ${i + 1} snap ik nog niet.` };
    }

    commands.push(allowed[lines[i]]);
  }

  return { ok: true, commands };
}

function moveCodeHero(direction) {
  const next = { x: codeX, y: codeY };

  if (direction === "up") next.y--;
  if (direction === "down") next.y++;
  if (direction === "left") next.x--;
  if (direction === "right") next.x++;

  if (next.x < 0 || next.y < 0 || next.x > 4 || next.y > 4) {
    bump($("codeHero"), codeX, codeY);
    return;
  }

  codeX = next.x;
  codeY = next.y;
  updateCodeHero();
}

function updateCodeHero() {
  $("codeHero").style.transform = `translate(${codeX * 100}%, ${codeY * 100}%)`;
  $("codeBubble").style.transform = `translate(${codeX * 100}%, ${codeY * 100}%)`;
}

function hasCodeWon() {
  return codeX === 4 && codeY === 4;
}

function showCodeMessage(type, title, text) {
  const message = $("codeMessage");
  message.className = `message ${type}`;
  $("codeMessageTitle").textContent = title;
  $("codeMessageText").textContent = text;
}

function hideCodeMessage() {
  $("codeMessage").className = "message hidden";
}

async function talk(targetBubble) {
  const text = selectedAvatar === "🤖" ? "Biep!" : selectedAvatar === "🦄" ? "Sparkle!" : "Miauw!";

  targetBubble.textContent = text;
  targetBubble.classList.remove("hidden");

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const sound = new SpeechSynthesisUtterance(text);
    sound.lang = "nl-NL";
    sound.rate = 1.15;
    sound.pitch = 1.7;
    window.speechSynthesis.speak(sound);
  }

  await wait(620);
  hideBubble(targetBubble);
}

async function dance(node) {
  node.classList.add("dance");
  await wait(580);
  node.classList.remove("dance");
}

function hideBubble(targetBubble) {
  targetBubble.classList.add("hidden");
}

function bump(node, x, y) {
  node.animate([
    { transform: `translate(${x * 100}%, ${y * 100}%) rotate(0deg)` },
    { transform: `translate(${x * 100}%, ${y * 100}%) rotate(-8deg)` },
    { transform: `translate(${x * 100}%, ${y * 100}%) rotate(8deg)` },
    { transform: `translate(${x * 100}%, ${y * 100}%) rotate(0deg)` }
  ], { duration: 220, iterations: 1 });
}

function has(list, x, y) {
  return list.some((item) => item.x === x && item.y === y);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

showScreen("home");
