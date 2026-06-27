let steps = [];
let catX = 0;
let catY = 0;
let isPlaying = false;
let isGameOver = false;
let currentMissionIndex = 0;
let controlsInverted = false;
let swampTriggered = false;

const grid = document.getElementById("grid");
const cat = document.getElementById("cat");
const fish = document.getElementById("fish");
const rock = document.getElementById("rock");
const stepsElement = document.getElementById("steps");
const successMessage = document.getElementById("successMessage");
const dangerMessage = document.getElementById("dangerMessage");
const swampMessage = document.getElementById("swampMessage");
const successText = document.getElementById("successText");
const dangerText = document.getElementById("dangerText");
const speechBubble = document.getElementById("speechBubble");
const missionLabel = document.getElementById("missionLabel");
const missionTitle = document.getElementById("missionTitle");

const gridSize = 5;

const missions = [
  {
    label: "Missie 1",
    title: "Breng de kat naar de vis 🐟",
    success: "De kat heeft de vis gevonden.",
    start: { x: 0, y: 0 },
    fish: { x: 4, y: 4 },
    walls: [],
    lava: [],
    swamp: null,
    showSwampAfterTrigger: false
  },
  {
    label: "Missie 2",
    title: "Ontsnap uit het lava-doolhof 🔥",
    success: "De kat is veilig bij de vis.",
    start: { x: 0, y: 0 },
    fish: { x: 4, y: 4 },
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 4, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 3 }
    ],
    lava: [
      { x: 2, y: 1 },
      { x: 4, y: 2 }
    ],
    swamp: null,
    showSwampAfterTrigger: false
  },
  {
    label: "Missie 3",
    title: "Pas op voor het geheime moeras 🫧",
    success: "De kat vond de vis, zelfs met omgekeerde knoppen.",
    start: { x: 0, y: 0 },
    fish: { x: 4, y: 4 },
    walls: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 2, y: 3 }
    ],
    lava: [
      { x: 3, y: 2 }
    ],
    swamp: { x: 2, y: 0 },
    showSwampAfterTrigger: true
  }
];

function setupGame() {
  loadMission(0);
}

function loadMission(index) {
  if (isPlaying) return;

  currentMissionIndex = index;
  const mission = getCurrentMission();

  missionLabel.textContent = mission.label;
  missionTitle.textContent = mission.title;
  successText.textContent = mission.success;

  updateMissionButtons();
  drawMaze();
  placeFish();
  resetGame();
}

function getCurrentMission() {
  return missions[currentMissionIndex];
}

function updateMissionButtons() {
  for (let i = 0; i < missions.length; i++) {
    const button = document.getElementById(`missionButton${i}`);
    button.classList.toggle("active", i === currentMissionIndex);
  }
}

function drawMaze() {
  const oldCells = document.querySelectorAll(".cell");
  oldCells.forEach((cell) => cell.remove());

  const mission = getCurrentMission();

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.className = "cell path";
      cell.style.left = `${x * 20}%`;
      cell.style.top = `${y * 20}%`;
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (isWall(x, y)) {
        cell.className = "cell wall";
      }

      if (isLava(x, y)) {
        cell.className = "cell lava";
      }

      if (
        mission.showSwampAfterTrigger &&
        swampTriggered &&
        isSwamp(x, y)
      ) {
        cell.className = "cell swamp-visible";
      }

      grid.appendChild(cell);
    }
  }
}

function placeFish() {
  const mission = getCurrentMission();
  fish.style.transform = `translate(${mission.fish.x * 100}%, ${mission.fish.y * 100}%)`;
}

function addStep(action) {
  if (isPlaying) return;

  if (isGameOver) {
    clearMessages();
    hideRock();
    isGameOver = false;
  }

  steps.push(action);
  renderSteps();
}

function renderSteps() {
  stepsElement.innerHTML = "";

  if (steps.length === 0) {
    const emptyState = document.createElement("span");
    emptyState.className = "empty-state";
    emptyState.textContent = "Kies je plaatjes.";
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
  return "❓";
}

async function playProgram() {
  if (isPlaying || steps.length === 0) return;

  isPlaying = true;
  isGameOver = false;
  controlsInverted = false;
  swampTriggered = false;

  clearMessages();
  hideSpeechBubble();
  hideRock();
  resetCatPositionOnly();
  drawMaze();

  await wait(250);

  for (const step of steps) {
    if (step === "meow") {
      await meow();
    } else {
      const direction = getActualDirection(step);
      moveCat(direction);
      await wait(420);

      if (isLava(catX, catY)) {
        await failWithRock("Rotsblok! Probeer opnieuw.");
        return;
      }

      if (isSwamp(catX, catY) && !swampTriggered) {
        await triggerSwamp();
      }
    }
  }

  checkWin();

  isPlaying = false;
}

function getActualDirection(direction) {
  if (!controlsInverted) return direction;

  if (direction === "left") return "right";
  if (direction === "right") return "left";
  if (direction === "up") return "down";
  if (direction === "down") return "up";

  return direction;
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

async function triggerSwamp() {
  swampTriggered = true;
  controlsInverted = true;

  cat.classList.add("sunk");
  swampMessage.classList.remove("hidden");
  drawMaze();

  await wait(900);

  cat.classList.remove("sunk");
}

async function failWithRock(message) {
  isGameOver = true;
  dangerText.textContent = message;

  showRockAtCat();
  showDanger();

  await wait(900);

  steps = [];
  controlsInverted = false;
  swampTriggered = false;

  renderSteps();
  resetCatPositionOnly();
  drawMaze();

  isPlaying = false;
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
  speechBubble.classList.remove("hidden");
  moveSpeechBubble();
  playMeowSound();

  await wait(800);

  hideSpeechBubble();
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

function checkWin() {
  const mission = getCurrentMission();

  if (catX === mission.fish.x && catY === mission.fish.y) {
    successMessage.classList.remove("hidden");
  }
}

function showDanger() {
  dangerMessage.classList.remove("hidden");
}

function clearMessages() {
  successMessage.classList.add("hidden");
  dangerMessage.classList.add("hidden");
  swampMessage.classList.add("hidden");
}

function resetCatPositionOnly() {
  const mission = getCurrentMission();

  catX = mission.start.x;
  catY = mission.start.y;

  updateCatPosition();
}

function resetGame() {
  if (isPlaying) return;

  steps = [];
  isGameOver = false;
  controlsInverted = false;
  swampTriggered = false;

  renderSteps();
  clearMessages();
  hideSpeechBubble();
  hideRock();
  resetCatPositionOnly();
  drawMaze();
}

function nextMission() {
  const nextIndex = currentMissionIndex + 1;

  if (nextIndex < missions.length) {
    loadMission(nextIndex);
  } else {
    loadMission(0);
  }
}

function isWall(x, y) {
  const mission = getCurrentMission();
  return mission.walls.some((wall) => wall.x === x && wall.y === y);
}

function isLava(x, y) {
  const mission = getCurrentMission();
  return mission.lava.some((lava) => lava.x === x && lava.y === y);
}

function isSwamp(x, y) {
  const mission = getCurrentMission();

  if (!mission.swamp) return false;

  return mission.swamp.x === x && mission.swamp.y === y;
}

function isOutsideGrid(x, y) {
  return x < 0 || x >= gridSize || y < 0 || y >= gridSize;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

setupGame();
