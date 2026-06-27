let steps = [];
let catX = 0;
let catY = 0;
let isPlaying = false;
let isGameOver = false;

const grid = document.getElementById("grid");
const cat = document.getElementById("cat");
const fish = document.getElementById("fish");
const rock = document.getElementById("rock");
const stepsElement = document.getElementById("steps");
const successMessage = document.getElementById("successMessage");
const dangerMessage = document.getElementById("dangerMessage");
const speechBubble = document.getElementById("speechBubble");

const gridSize = 5;

const startPosition = { x: 0, y: 0 };
const fishPosition = { x: 4, y: 4 };

const walls = [
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 4, y: 1 },
  { x: 1, y: 3 },
  { x: 2, y: 3 }
];

const lavaTiles = [
  { x: 2, y: 1 },
  { x: 4, y: 2 }
];

function setupGame() {
  drawMaze();
  placeFish();
  resetGame();
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

      if (isWall(x, y)) {
        cell.className = "cell wall";
      }

      if (isLava(x, y)) {
        cell.className = "cell lava";
      }

      grid.appendChild(cell);
    }
  }
}

function placeFish() {
  fish.style.transform = `translate(${fishPosition.x * 100}%, ${fishPosition.y * 100}%)`;
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

  clearMessages();
  hideSpeechBubble();
  hideRock();
  resetCatPositionOnly();

  await wait(250);

  for (const step of steps) {
    if (step === "meow") {
      await meow();
    } else {
      moveCat(step);
      await wait(420);

      if (isLava(catX, catY)) {
        await failWithRock();
        return;
      }
    }
  }

  checkWin();

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

async function failWithRock() {
  isGameOver = true;
  showRockAtCat();
  showDanger();

  await wait(900);

  steps = [];
  renderSteps();
  resetCatPositionOnly();

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
  if (catX === fishPosition.x && catY === fishPosition.y) {
    successMessage.classList.remove("hidden");
  }
}

function showDanger() {
  dangerMessage.classList.remove("hidden");
}

function clearMessages() {
  successMessage.classList.add("hidden");
  dangerMessage.classList.add("hidden");
}

function resetCatPositionOnly() {
  catX = startPosition.x;
  catY = startPosition.y;
  updateCatPosition();
}

function resetGame() {
  if (isPlaying) return;

  steps = [];
  isGameOver = false;

  renderSteps();
  clearMessages();
  hideSpeechBubble();
  hideRock();
  resetCatPositionOnly();
}

function isWall(x, y) {
  return walls.some((wall) => wall.x === x && wall.y === y);
}

function isLava(x, y) {
  return lavaTiles.some((lava) => lava.x === x && lava.y === y);
}

function isOutsideGrid(x, y) {
  return x < 0 || x >= gridSize || y < 0 || y >= gridSize;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

setupGame();
