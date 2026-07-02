let steps = [];
let catX = 0;
let catY = 0;
let isPlaying = false;
let isGameOver = false;
let currentWorldIndex = 0;
let switchOn = false;

const grid = document.getElementById("grid");
const cat = document.getElementById("cat");
const fish = document.getElementById("fish");
const rock = document.getElementById("rock");
const stepsElement = document.getElementById("steps");
const successMessage = document.getElementById("successMessage");
const dangerMessage = document.getElementById("dangerMessage");
const successText = document.getElementById("successText");
const dangerText = document.getElementById("dangerText");
const dangerIcon = document.getElementById("dangerIcon");
const speechBubble = document.getElementById("speechBubble");
const worldLabel = document.getElementById("worldLabel");
const missionTitle = document.getElementById("missionTitle");
const lessonText = document.getElementById("lessonText");
const stepCounter = document.getElementById("stepCounter");
const blocks = document.getElementById("blocks");

const gridSize = 5;

const worlds = [
  {
    label: "Wereld 1",
    name: "Bewegen",
    title: "Breng de kat naar de vis 🐟",
    lesson: "Zet stappen achter elkaar. Gebruik 🔁 om minder blokjes te gebruiken.",
    success: "Je eerste programma werkt.",
    start: { x: 0, y: 0 },
    fish: { x: 4, y: 4 },
    walls: [],
    lava: [],
    switchTile: null,
    door: null,
    maxSteps: 8,
    blocks: ["up", "down", "left", "right", "repeatRight", "play"]
  },
  {
    label: "Wereld 2",
    name: "Verhalen",
    title: "Maak een kattenverhaal 🎭",
    lesson: "Code kan bewegen, praten en dansen.",
    success: "De kat heeft een mini-verhaal gemaakt.",
    start: { x: 0, y: 0 },
    fish: { x: 4, y: 4 },
    walls: [],
    lava: [],
    switchTile: null,
    door: null,
    maxSteps: 10,
    blocks: ["right", "down", "meow", "dance", "repeatRight", "play"],
    requiredActions: ["meow", "dance"]
  },
  {
    label: "Wereld 3",
    name: "Slimme regels",
    title: "Open de deur met een regel 🔘",
    lesson: "Als de schakelaar aan is, mag de kat door de deur.",
    success: "Je hebt een als-dan-regel gebruikt.",
    start: { x: 0, y: 0 },
    fish: { x: 4, y: 4 },
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 3, y: 3 }
    ],
    lava: [
      { x: 2, y: 3 }
    ],
    switchTile: { x: 2, y: 1 },
    door: { x: 3, y: 2 },
    maxSteps: 10,
    blocks: ["up", "down", "left", "right", "ifSwitchOpen", "meow", "play"]
  }
];

function setupGame() {
  loadWorld(0);
}

function loadWorld(index) {
  if (isPlaying) return;

  currentWorldIndex = index;
  const world = getCurrentWorld();

  worldLabel.textContent = `${world.label}: ${world.name}`;
  missionTitle.textContent = world.title;
  lessonText.textContent = world.lesson;
  successText.textContent = world.success;

  updateWorldButtons();
  renderBlockButtons();
  resetGame();
}

function getCurrentWorld() {
  return worlds[currentWorldIndex];
}

function updateWorldButtons() {
  for (let i = 0; i < worlds.length; i++) {
    const button = document.getElementById(`worldButton${i}`);
    button.classList.toggle("active", i === currentWorldIndex);
  }
}

function renderBlockButtons() {
  const world = getCurrentWorld();
  blocks.innerHTML = "";

  world.blocks.forEach((blockName) => {
    const button = document.createElement("button");

    if (blockName === "play") {
      button.textContent = "▶️";
      button.className = "play";
      button.onclick = playProgram;
    } else {
      button.textContent = getBlockButtonLabel(blockName);
      button.onclick = () => addStep(blockName);

      if (["meow", "dance"].includes(blockName)) button.className = "fun";
      if (["repeatRight", "ifSwitchOpen"].includes(blockName)) button.className = "smart";
    }

    blocks.appendChild(button);
  });
}

function getBlockButtonLabel(blockName) {
  if (blockName === "up") return "⬆️";
  if (blockName === "down") return "⬇️";
  if (blockName === "left") return "⬅️";
  if (blockName === "right") return "➡️";
  if (blockName === "meow") return "🔊";
  if (blockName === "dance") return "💃";
  if (blockName === "repeatRight") return "🔁➡️";
  if (blockName === "ifSwitchOpen") return "🔘?🚪";
  return "❓";
}

function drawMaze() {
  const oldCells = document.querySelectorAll(".cell");
  oldCells.forEach((cell) => cell.remove());

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.className = "cell path";
      cell.style.left = `${x * 20}%`;
      cell.style.top = `${y * 20}%`;

      if (isWall(x, y)) cell.className = "cell wall";
      if (isLava(x, y)) cell.className = "cell lava";
      if (isSwitchTile(x, y)) cell.className = "cell switch-tile";
      if (isDoor(x, y) && !switchOn) cell.className = "cell door";

      grid.appendChild(cell);
    }
  }
}

function placeFish() {
  const world = getCurrentWorld();
  const fishX = `${world.fish.x * 100}%`;
  const fishY = `${world.fish.y * 100}%`;

  fish.style.setProperty("--fish-x", fishX);
  fish.style.setProperty("--fish-y", fishY);
  fish.style.transform = `translate(${fishX}, ${fishY})`;
}

function addStep(action) {
  if (isPlaying) return;

  if (isGameOver) {
    clearMessages();
    hideRock();
    isGameOver = false;
  }

  const world = getCurrentWorld();

  if (steps.length >= world.maxSteps) {
    showSoftWarning("Maximaal aantal blokjes bereikt.", "✋");
    return;
  }

  steps.push(action);
  renderSteps();
}

function clearProgram() {
  if (isPlaying) return;
  steps = [];
  renderSteps();
  clearMessages();
}

function renderSteps() {
  const world = getCurrentWorld();
  stepCounter.textContent = `${steps.length}/${world.maxSteps}`;
  stepsElement.innerHTML = "";

  if (steps.length === 0) {
    const emptyState = document.createElement("span");
    emptyState.className = "empty-state";
    emptyState.textContent = "Kies blokjes.";
    stepsElement.appendChild(emptyState);
    return;
  }

  steps.forEach((step) => {
    const block = document.createElement("div");
    block.className = "step";
    block.textContent = getStepIcon(step);
    stepsElement.appendChild(block);
  });
}

function getStepIcon(step) {
  if (step === "up") return "⬆️";
  if (step === "down") return "⬇️";
  if (step === "left") return "⬅️";
  if (step === "right") return "➡️";
  if (step === "meow") return "🔊";
  if (step === "dance") return "💃";
  if (step === "repeatRight") return "🔁➡️";
  if (step === "ifSwitchOpen") return "🔘?🚪";
  return "❓";
}

async function playProgram() {
  if (isPlaying || steps.length === 0) return;

  isPlaying = true;
  isGameOver = false;
  switchOn = false;

  clearMessages();
  hideSpeechBubble();
  hideRock();
  resetCatPositionOnly();
  drawMaze();

  await wait(220);

  for (const step of steps) {
    if (hasWon()) {
      await finishWorld();
      return;
    }

    await runStep(step);

    if (isLava(catX, catY)) {
      await failWithRock("Lava! Probeer opnieuw.");
      return;
    }

    if (isSwitchTile(catX, catY)) {
      switchOn = true;
      drawMaze();
      await say("Klik!");
    }

    if (hasWon()) {
      await finishWorld();
      return;
    }
  }

  if (!hasWon()) {
    showSoftWarning("Nog niet klaar. Verbeter je programma.", "🐟");
  }

  isPlaying = false;
}

async function runStep(step) {
  if (step === "meow") {
    await meow();
    return;
  }

  if (step === "dance") {
    await dance();
    return;
  }

  if (step === "repeatRight") {
    for (let i = 0; i < 4; i++) {
      moveCat("right");
      await wait(330);
      if (isLava(catX, catY) || hasWon()) return;
      if (isSwitchTile(catX, catY)) {
        switchOn = true;
        drawMaze();
        await say("Klik!");
      }
    }
    return;
  }

  if (step === "ifSwitchOpen") {
    if (switchOn) {
      await say("Deur open!");
      drawMaze();
    } else {
      await say("Eerst knop!");
    }
    return;
  }

  moveCat(step);
  await wait(390);
}

async function finishWorld() {
  const world = getCurrentWorld();

  if (world.requiredActions) {
    const allDone = world.requiredActions.every((action) => steps.includes(action));

    if (!allDone) {
      showSoftWarning("Maak ook geluid én dans.", "🎭");
      isPlaying = false;
      return;
    }
  }

  showSuccess();
  isPlaying = false;
}

function moveCat(direction) {
  let nextX = catX;
  let nextY = catY;

  if (direction === "up") nextY--;
  if (direction === "down") nextY++;
  if (direction === "left") nextX--;
  if (direction === "right") nextX++;

  if (isOutsideGrid(nextX, nextY)) {
    bumpCat();
    return;
  }

  if (isWall(nextX, nextY)) {
    bumpCat();
    return;
  }

  if (isDoor(nextX, nextY) && !switchOn) {
    bumpCat();
    return;
  }

  catX = nextX;
  catY = nextY;

  updateCatPosition();
}

function updateCatPosition() {
  cat.style.transform = `translate(${catX * 100}%, ${catY * 100}%)`;
  moveSpeechBubble();
}

function bumpCat() {
  cat.animate(
    [
      { transform: `translate(${catX * 100}%, ${catY * 100}%) rotate(0deg)` },
      { transform: `translate(${catX * 100}%, ${catY * 100}%) rotate(-8deg)` },
      { transform: `translate(${catX * 100}%, ${catY * 100}%) rotate(8deg)` },
      { transform: `translate(${catX * 100}%, ${catY * 100}%) rotate(0deg)` }
    ],
    {
      duration: 220,
      iterations: 1
    }
  );
}

async function failWithRock(message) {
  isGameOver = true;
  dangerText.textContent = message;
  dangerIcon.textContent = "🪨";

  showRockAtCat();
  showDanger();

  await wait(850);

  steps = [];
  switchOn = false;

  renderSteps();
  resetCatPositionOnly();
  drawMaze();

  isPlaying = false;
}

function showSoftWarning(message, icon) {
  dangerIcon.textContent = icon;
  dangerText.textContent = message;
  dangerMessage.classList.remove("hidden");
}

function showRockAtCat() {
  rock.classList.remove("hidden");
  rock.classList.remove("falling");

  const rockX = `${catX * 100}%`;
  const rockY = `${catY * 100}%`;

  rock.style.setProperty("--rock-x", rockX);
  rock.style.setProperty("--rock-y", rockY);
  rock.style.transform = `translate(${rockX}, -120%)`;

  void rock.offsetWidth;

  rock.classList.add("falling");
}

function hideRock() {
  rock.classList.add("hidden");
  rock.classList.remove("falling");
}

async function meow() {
  await say("Miauw!");
  playMeowSound();
}

async function say(text) {
  speechBubble.textContent = text;
  speechBubble.classList.remove("hidden");
  moveSpeechBubble();

  await wait(680);

  hideSpeechBubble();
}

async function dance() {
  cat.classList.add("dance");
  await wait(600);
  cat.classList.remove("dance");
}

function playMeowSound() {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const meow = new SpeechSynthesisUtterance("miauw");
  meow.lang = "nl-NL";
  meow.rate = 1.15;
  meow.pitch = 1.7;
  meow.volume = 1;

  window.speechSynthesis.speak(meow);
}

function moveSpeechBubble() {
  speechBubble.style.transform = `translate(${catX * 100}%, ${catY * 100}%)`;
}

function hideSpeechBubble() {
  speechBubble.classList.add("hidden");
}

function hasWon() {
  const world = getCurrentWorld();
  return catX === world.fish.x && catY === world.fish.y;
}

function showSuccess() {
  successMessage.classList.remove("hidden");
}

function showDanger() {
  dangerMessage.classList.remove("hidden");
}

function clearMessages() {
  successMessage.classList.add("hidden");
  dangerMessage.classList.add("hidden");
}

function resetCatPositionOnly() {
  const world = getCurrentWorld();

  catX = world.start.x;
  catY = world.start.y;

  updateCatPosition();
}

function resetGame() {
  if (isPlaying) return;

  steps = [];
  isGameOver = false;
  switchOn = false;

  renderSteps();
  clearMessages();
  hideSpeechBubble();
  hideRock();
  resetCatPositionOnly();
  placeFish();
  drawMaze();
}

function nextWorld() {
  const nextIndex = currentWorldIndex + 1;

  if (nextIndex < worlds.length) {
    loadWorld(nextIndex);
  } else {
    loadWorld(0);
  }
}

function isWall(x, y) {
  const world = getCurrentWorld();
  return world.walls.some((wall) => wall.x === x && wall.y === y);
}

function isLava(x, y) {
  const world = getCurrentWorld();
  return world.lava.some((lava) => lava.x === x && lava.y === y);
}

function isSwitchTile(x, y) {
  const world = getCurrentWorld();

  if (!world.switchTile) return false;

  return world.switchTile.x === x && world.switchTile.y === y;
}

function isDoor(x, y) {
  const world = getCurrentWorld();

  if (!world.door) return false;

  return world.door.x === x && world.door.y === y;
}

function isOutsideGrid(x, y) {
  return x < 0 || x >= gridSize || y < 0 || y >= gridSize;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

setupGame();
