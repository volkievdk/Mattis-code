const levels = [
  {
    world: 0, label: "Level 1", name: "Eerste stappen", title: "Breng de kat naar de vis 🐟",
    lesson: "Volgorde: eerst dit, dan dat.",
    success: "Je eerste programma werkt.",
    size: 5, maxSteps: 8,
    start: { x: 0, y: 0 }, fish: { x: 4, y: 4 },
    walls: [], water: [], lava: [], switches: [], doors: [], stars: [],
    blocks: ["up", "down", "left", "right", "play"]
  },
  {
    world: 0, label: "Level 2", name: "Korter maken", title: "Gebruik herhaal-blokjes 🔁",
    lesson: "Herhaling: één blokje kan veel stappen doen.",
    success: "Je gebruikte minder blokjes.",
    size: 5, maxSteps: 4,
    start: { x: 0, y: 0 }, fish: { x: 4, y: 4 },
    walls: [], water: [], lava: [], switches: [], doors: [], stars: [],
    blocks: ["right", "down", "repeatRight", "repeatDown", "play"]
  },
  {
    world: 0, label: "Level 3", name: "Debug", title: "Ontwijk de lava 🔥",
    lesson: "Debuggen: fout? Pas je code aan.",
    success: "Je hebt de veilige route gevonden.",
    size: 5, maxSteps: 8,
    start: { x: 0, y: 0 }, fish: { x: 4, y: 4 },
    walls: [{x:1,y:0},{x:1,y:1},{x:4,y:1},{x:1,y:3},{x:2,y:3}],
    water: [], lava: [{x:2,y:1},{x:4,y:2}], switches: [], doors: [], stars: [],
    blocks: ["up", "down", "left", "right", "play"]
  },
  {
    world: 0, label: "Level 4", name: "Vijver", title: "Loop om de vijver heen 💧",
    lesson: "Planning: kijk eerst naar de route.",
    success: "De kat bleef droog.",
    size: 6, maxSteps: 10,
    start: { x: 0, y: 0 }, fish: { x: 5, y: 5 },
    walls: [],
    water: [{x:2,y:1},{x:3,y:1},{x:2,y:2},{x:3,y:2},{x:2,y:3},{x:3,y:3}],
    lava: [], switches: [], doors: [], stars: [],
    blocks: ["up", "down", "left", "right", "repeatRight", "repeatDown", "play"]
  },
  {
    world: 1, label: "Level 5", name: "Miauw", title: "Laat de kat miauwen 🔊",
    lesson: "Acties: code kan ook geluid maken.",
    success: "De kat praatte én vond de vis.",
    size: 5, maxSteps: 9,
    start: { x: 0, y: 0 }, fish: { x: 4, y: 4 },
    walls: [], water: [], lava: [], switches: [], doors: [], stars: [],
    requiredActions: ["meow"],
    blocks: ["right", "down", "repeatRight", "repeatDown", "meow", "play"]
  },
  {
    world: 1, label: "Level 6", name: "Dans", title: "Maak een kattenverhaal 💃",
    lesson: "Creatie: combineer bewegen, geluid en dans.",
    success: "Je maakte een mini-verhaal.",
    size: 5, maxSteps: 10,
    start: { x: 0, y: 0 }, fish: { x: 4, y: 4 },
    walls: [], water: [], lava: [], switches: [], doors: [], stars: [],
    requiredActions: ["meow", "dance"],
    blocks: ["right", "down", "repeatRight", "repeatDown", "meow", "dance", "play"]
  },
  {
    world: 1, label: "Level 7", name: "Ster", title: "Pak de ster voor de vis ⭐",
    lesson: "Doelen: soms moet je eerst iets verzamelen.",
    success: "Ster gepakt. Vis gevonden.",
    size: 6, maxSteps: 10,
    start: { x: 0, y: 0 }, fish: { x: 5, y: 5 },
    walls: [{x:1,y:1},{x:2,y:1},{x:4,y:1},{x:1,y:3},{x:3,y:3},{x:4,y:3}],
    water: [], lava: [], switches: [], doors: [], stars: [{x:5,y:0}],
    mustCollectStars: true,
    blocks: ["up", "down", "left", "right", "repeatRight", "repeatDown", "meow", "play"]
  },
  {
    world: 2, label: "Level 8", name: "Knop en deur", title: "Knop aan. Deur open. 🔘🚪",
    lesson: "Eerst de knop. Dan het als-dan-blok. Dan mag je door.",
    success: "Je opende de deur met een regel.",
    size: 5, maxSteps: 8,
    start: { x: 0, y: 2 }, fish: { x: 4, y: 2 },
    walls: [{x:1,y:1},{x:1,y:3},{x:3,y:1},{x:3,y:3}],
    water: [], lava: [], switches: [{x:2,y:2}], doors: [{x:3,y:2}], stars: [],
    mustUseActions: ["ifSwitchOpen"],
    blocks: ["left", "right", "ifSwitchOpen", "meow", "play"]
  },
  {
    world: 2, label: "Level 9", name: "Als-dan", title: "Open de deur in het pad 🚪",
    lesson: "Een regel werkt pas als de voorwaarde waar is.",
    success: "Je gebruikte een als-dan-blok op het juiste moment.",
    size: 6, maxSteps: 11,
    start: { x: 0, y: 0 }, fish: { x: 5, y: 5 },
    walls: [{x:1,y:0},{x:3,y:0},{x:1,y:1},{x:3,y:1},{x:1,y:3},{x:2,y:3},{x:4,y:3}],
    water: [], lava: [{x:2,y:4}], switches: [{x:2,y:1}], doors: [{x:4,y:2}], stars: [],
    blocks: ["up", "down", "left", "right", "repeatRight", "repeatDown", "ifSwitchOpen", "play"]
  },
  {
    world: 2, label: "Level 10", name: "Eindbaas", title: "Eindbaas: ster, knop, deur 🧠",
    lesson: "Alles samen: pak de ster, druk de knop in, open de deur.",
    success: "Eindbaas gehaald. Jij programmeert echt.",
    size: 7, maxSteps: 14,
    start: { x: 0, y: 0 }, fish: { x: 6, y: 6 },
    walls: [
      {x:1,y:1},{x:2,y:1},{x:3,y:1},{x:5,y:1},
      {x:1,y:3},{x:3,y:3},{x:4,y:3},{x:5,y:3},
      {x:1,y:5},{x:2,y:5},{x:4,y:5},{x:5,y:5}
    ],
    water: [{x:2,y:3}],
    lava: [{x:5,y:2}],
    switches: [{x:3,y:2}], doors: [{x:6,y:3}], stars: [{x:6,y:0}],
    mustCollectStars: true,
    mustUseActions: ["ifSwitchOpen"],
    blocks: ["up", "down", "left", "right", "repeatRight", "repeatDown", "ifSwitchOpen", "meow", "play"]
  }
];

const blockData = {
  up: { icon: "⬆️", label: "omhoog" },
  down: { icon: "⬇️", label: "omlaag" },
  left: { icon: "⬅️", label: "links" },
  right: { icon: "➡️", label: "rechts" },
  repeatRight: { icon: "🔁➡️", label: "4x rechts", kind: "smart" },
  repeatDown: { icon: "🔁⬇️", label: "4x omlaag", kind: "smart" },
  meow: { icon: "🔊", label: "miauw", kind: "fun" },
  dance: { icon: "💃", label: "dans", kind: "fun" },
  ifSwitchOpen: { icon: "🔘?🚪", label: "als-dan", kind: "smart" },
  play: { icon: "▶️", label: "play", kind: "play" }
};

let currentLevelIndex = 0;
let steps = [];
let catX = 0;
let catY = 0;
let isPlaying = false;
let switchOn = false;
let doorOpen = false;
let collectedStarKeys = new Set();
let actionHistory = [];
let isGameOver = false;

const grid = document.getElementById("grid");
const cat = document.getElementById("cat");
const fish = document.getElementById("fish");
const rock = document.getElementById("rock");
const bubble = document.getElementById("bubble");
const program = document.getElementById("program");
const blocks = document.getElementById("blocks");
const levelTitle = document.getElementById("levelTitle");
const levelLabel = document.getElementById("levelLabel");
const lessonText = document.getElementById("lessonText");
const stepCounter = document.getElementById("stepCounter");
const message = document.getElementById("message");
const messageIcon = document.getElementById("messageIcon");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const nextButton = document.getElementById("nextButton");
const levelStrip = document.getElementById("levelStrip");

document.getElementById("resetButton").addEventListener("click", resetGame);
document.getElementById("clearButton").addEventListener("click", clearProgram);
nextButton.addEventListener("click", nextLevel);

document.querySelectorAll("[data-world]").forEach((button) => {
  button.addEventListener("click", () => {
    const world = Number(button.dataset.world);
    const index = levels.findIndex((level) => level.world === world);
    loadLevel(index);
  });
});

function setup() {
  buildLevelStrip();
  loadLevel(0);
}

function buildLevelStrip() {
  levelStrip.innerHTML = "";
  levels.forEach((level, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = index + 1;
    button.setAttribute("aria-label", level.label);
    button.addEventListener("click", () => loadLevel(index));
    levelStrip.appendChild(button);
  });
}

function loadLevel(index) {
  if (isPlaying) return;
  currentLevelIndex = index;
  const level = getLevel();

  levelTitle.textContent = level.title;
  levelLabel.textContent = `${level.label}: ${level.name}`;
  lessonText.textContent = level.lesson;

  resetGame();
  renderBlocks();
  updateNavigation();
}

function getLevel() {
  return levels[currentLevelIndex];
}

function updateNavigation() {
  document.querySelectorAll(".level-strip button").forEach((button, index) => {
    button.classList.toggle("active", index === currentLevelIndex);
  });

  document.querySelectorAll("[data-world]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.world) === getLevel().world);
  });
}

function renderBlocks() {
  blocks.innerHTML = "";
  getLevel().blocks.forEach((name) => {
    const data = blockData[name];
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<span>${data.icon}</span>${data.label}`;
    button.className = data.kind || "";
    button.addEventListener("click", () => {
      if (name === "play") {
        playProgram();
      } else {
        addStep(name);
      }
    });
    blocks.appendChild(button);
  });
}

function renderGrid() {
  const level = getLevel();
  const cell = 100 / level.size;

  grid.style.setProperty("--cell", `${cell}%`);
  grid.style.setProperty("--size", level.size);
  grid.querySelectorAll(".cell").forEach((node) => node.remove());

  for (let y = 0; y < level.size; y++) {
    for (let x = 0; x < level.size; x++) {
      const tile = document.createElement("div");
      tile.className = `cell ${tileClass(x, y)}`;
      tile.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
      grid.appendChild(tile);
    }
  }

  placeFish();
}

function tileClass(x, y) {
  const level = getLevel();

  if (has(level.walls, x, y)) return "wall";
  if (has(level.water, x, y)) return "water";
  if (has(level.lava, x, y)) return "lava";
  if (has(level.switches, x, y)) return "switch";
  if (has(level.doors, x, y) && !doorOpen) return "door";
  if (has(level.stars, x, y) && !isStarCollected(x, y)) return "star";

  return "path";
}

function addStep(name) {
  if (isPlaying) return;
  if (isGameOver) {
    hideMessage();
    hideRock();
    isGameOver = false;
  }

  if (steps.length >= getLevel().maxSteps) {
    showMessage("warning", "✋", "Vol", "Je hebt genoeg blokjes. Druk op play of maak leeg.", false);
    return;
  }

  steps.push(name);
  renderProgram();
}

function clearProgram() {
  if (isPlaying) return;
  steps = [];
  renderProgram();
  hideMessage();
}

function renderProgram() {
  stepCounter.textContent = `${steps.length}/${getLevel().maxSteps}`;
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

async function playProgram() {
  if (isPlaying || steps.length === 0) return;

  isPlaying = true;
  isGameOver = false;
  switchOn = false;
  doorOpen = false;
  collectedStarKeys = new Set();
  actionHistory = [];

  hideMessage();
  hideBubble();
  hideRock();
  resetCat();
  renderGrid();

  await wait(180);

  for (const step of steps) {
    if (hasWon()) return finishLevel();

    await runStep(step);

    if (await checkDanger()) return;
    await checkTileEffects();

    if (hasWon()) return finishLevel();
  }

  showMessage("warning", "🐟", "Bijna", "Nog niet bij de vis. Verbeter je code.", false);
  isPlaying = false;
}

async function runStep(step) {
  if (step === "meow") return meow();
  if (step === "dance") return dance();

  if (step === "repeatRight") return repeatMove("right");
  if (step === "repeatDown") return repeatMove("down");

  if (step === "ifSwitchOpen") {
    actionHistory.push("ifSwitchOpen");
    if (switchOn) {
      doorOpen = true;
      renderGrid();
      await say("Deur open!");
    } else {
      await say("Eerst knop!");
    }
    return;
  }

  moveCat(step);
  await wait(350);
}

async function repeatMove(direction) {
  for (let i = 0; i < 4; i++) {
    if (hasWon()) return;
    moveCat(direction);
    await wait(285);
    if (await checkDanger()) return;
    await checkTileEffects();
  }
}

function moveCat(direction) {
  const next = { x: catX, y: catY };

  if (direction === "up") next.y -= 1;
  if (direction === "down") next.y += 1;
  if (direction === "left") next.x -= 1;
  if (direction === "right") next.x += 1;

  if (isBlocked(next.x, next.y)) {
    bumpCat();
    return;
  }

  catX = next.x;
  catY = next.y;
  updateCat();
}

function isBlocked(x, y) {
  const level = getLevel();

  return (
    x < 0 || y < 0 || x >= level.size || y >= level.size ||
    has(level.walls, x, y) ||
    (has(level.doors, x, y) && !doorOpen)
  );
}

async function checkDanger() {
  const level = getLevel();

  if (has(level.lava, catX, catY)) {
    await fail("Lava! Probeer opnieuw.");
    return true;
  }

  if (has(level.water, catX, catY)) {
    await fail("Plons! Katten houden niet van water.");
    return true;
  }

  return false;
}

async function checkTileEffects() {
  const level = getLevel();

  if (has(level.switches, catX, catY) && !switchOn) {
    switchOn = true;
    renderGrid();
    await say("Klik!");
  }

  if (has(level.stars, catX, catY) && !isStarCollected(catX, catY)) {
    collectedStarKeys.add(starKey(catX, catY));
    renderGrid();
    await say("Ster!");
  }
}

function hasWon() {
  const level = getLevel();
  return catX === level.fish.x && catY === level.fish.y;
}

function finishLevel() {
  const level = getLevel();

  if (level.requiredActions) {
    const missing = level.requiredActions.some((action) => !actionHistory.includes(action));
    if (missing) {
      showMessage("warning", "🎭", "Nog iets", "Gebruik ook de verhaal-blokjes.", false);
      isPlaying = false;
      return;
    }
  }

  if (level.mustUseActions) {
    const missing = level.mustUseActions.some((action) => !actionHistory.includes(action));
    if (missing) {
      showMessage("warning", "🔘", "Regel vergeten", "Gebruik ook het als-dan-blok.", false);
      isPlaying = false;
      return;
    }
  }

  if (level.mustCollectStars && collectedStarKeys.size < level.stars.length) {
    showMessage("warning", "⭐", "Ster vergeten", "Pak eerst de ster, dan de vis.", false);
    isPlaying = false;
    return;
  }

  showMessage("success", "✨", "Gelukt!", level.success, true);
  isPlaying = false;
}

async function fail(text) {
  isGameOver = true;
  showRock();
  showMessage("fail", "🪨", "Oeps", text, false);

  await wait(850);

  steps = [];
  renderProgram();
  resetRunState();
  resetCat();
  renderGrid();
  isPlaying = false;
}

function resetRunState() {
  switchOn = false;
  doorOpen = false;
  collectedStarKeys = new Set();
  actionHistory = [];
}

function showMessage(type, icon, title, text, showNext) {
  message.className = `message ${type}`;
  messageIcon.textContent = icon;
  messageTitle.textContent = title;
  messageText.textContent = text;
  nextButton.classList.toggle("hidden", !showNext);
}

function hideMessage() {
  message.className = "message hidden";
}

function showRock() {
  rock.classList.remove("hidden", "falling");
  const x = `${catX * 100}%`;
  const y = `${catY * 100}%`;

  rock.style.setProperty("--rock-x", x);
  rock.style.setProperty("--rock-y", y);
  rock.style.transform = `translate(${x}, -130%)`;

  void rock.offsetWidth;

  rock.classList.add("falling");
}

function hideRock() {
  rock.classList.add("hidden");
  rock.classList.remove("falling");
}

async function meow() {
  actionHistory.push("meow");
  await say("Miauw!");

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const sound = new SpeechSynthesisUtterance("miauw");
    sound.lang = "nl-NL";
    sound.rate = 1.15;
    sound.pitch = 1.7;
    window.speechSynthesis.speak(sound);
  }
}

async function dance() {
  actionHistory.push("dance");
  cat.classList.add("dance");
  await wait(600);
  cat.classList.remove("dance");
}

async function say(text) {
  bubble.textContent = text;
  bubble.classList.remove("hidden");
  moveBubble();

  await wait(650);

  hideBubble();
}

function hideBubble() {
  bubble.classList.add("hidden");
}

function resetCat() {
  catX = getLevel().start.x;
  catY = getLevel().start.y;
  updateCat();
}

function updateCat() {
  cat.style.transform = `translate(${catX * 100}%, ${catY * 100}%)`;
  moveBubble();
}

function moveBubble() {
  bubble.style.transform = `translate(${catX * 100}%, ${catY * 100}%)`;
}

function placeFish() {
  const fishX = `${getLevel().fish.x * 100}%`;
  const fishY = `${getLevel().fish.y * 100}%`;

  fish.style.setProperty("--fish-x", fishX);
  fish.style.setProperty("--fish-y", fishY);
  fish.style.transform = `translate(${fishX}, ${fishY})`;
}

function resetGame() {
  if (isPlaying) return;

  steps = [];
  isGameOver = false;
  resetRunState();
  hideMessage();
  hideBubble();
  hideRock();
  renderProgram();
  resetCat();
  renderGrid();
}

function nextLevel() {
  const next = currentLevelIndex + 1;
  loadLevel(next < levels.length ? next : 0);
}

function bumpCat() {
  cat.animate(
    [
      { transform: `translate(${catX * 100}%, ${catY * 100}%) rotate(0deg)` },
      { transform: `translate(${catX * 100}%, ${catY * 100}%) rotate(-8deg)` },
      { transform: `translate(${catX * 100}%, ${catY * 100}%) rotate(8deg)` },
      { transform: `translate(${catX * 100}%, ${catY * 100}%) rotate(0deg)` }
    ],
    { duration: 220, iterations: 1 }
  );
}

function has(list, x, y) {
  return list.some((item) => item.x === x && item.y === y);
}

function starKey(x, y) {
  return `${x},${y}`;
}

function isStarCollected(x, y) {
  return collectedStarKeys.has(starKey(x, y));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

setup();
