let steps = [];
let catX = 0;
let catY = 0;
let isPlaying = false;

const cat = document.getElementById("cat");
const stepsElement = document.getElementById("steps");
const successMessage = document.getElementById("successMessage");
const speechBubble = document.getElementById("speechBubble");

function addStep(action) {
  if (isPlaying) return;

  steps.push(action);
  hideSuccessMessage();
  renderSteps();
}

function renderSteps() {
  stepsElement.innerHTML = "";

  if (steps.length === 0) {
    const emptyState = document.createElement("span");
    emptyState.className = "empty-state";
    emptyState.textContent = "Kies plaatjes om je programma te maken.";
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
  hideSuccessMessage();
  hideSpeechBubble();
  resetCatPositionOnly();

  await wait(300);

  for (const step of steps) {
    if (step === "meow") {
      await meow();
    } else {
      moveCat(step);
      await wait(500);
    }
  }

  checkWin();
  isPlaying = false;
}

function moveCat(direction) {
  if (direction === "up" && catY > 0) catY--;
  if (direction === "down" && catY < 4) catY++;
  if (direction === "left" && catX > 0) catX--;
  if (direction === "right" && catX < 4) catX++;

  cat.style.transform = `translate(${catX * 100}%, ${catY * 100}%)`;
  moveSpeechBubble();
}

async function meow() {
  speechBubble.classList.remove("hidden");
  moveSpeechBubble();

  await wait(700);

  hideSpeechBubble();
}

function moveSpeechBubble() {
  speechBubble.style.transform = `translate(${catX * 100}%, ${catY * 100}%)`;
}

function hideSpeechBubble() {
  speechBubble.classList.add("hidden");
}

function checkWin() {
  if (catX === 4 && catY === 4) {
    successMessage.classList.remove("hidden");
  }
}

function hideSuccessMessage() {
  successMessage.classList.add("hidden");
}

function resetCatPositionOnly() {
  catX = 0;
  catY = 0;
  cat.style.transform = "translate(0%, 0%)";
  moveSpeechBubble();
}

function resetGame() {
  if (isPlaying) return;

  steps = [];
  renderSteps();
  hideSuccessMessage();
  hideSpeechBubble();
  resetCatPositionOnly();
}

function nextMission() {
  resetGame();

  alert("Missie 2 komt eraan 🚀");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

renderSteps();
