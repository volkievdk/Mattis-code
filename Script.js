let steps = [];
let catX = 0;
let catY = 0;

const cat = document.getElementById("cat");
const stepsElement = document.getElementById("steps");

function addStep(direction) {
  steps.push(direction);
  renderSteps();
}

function renderSteps() {
  stepsElement.innerHTML = "";

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
}

function moveCat(direction) {
  if (direction === "up" && catY > 0) catY--;
  if (direction === "down" && catY < 4) catY++;
  if (direction === "left" && catX > 0) catX--;
  if (direction === "right" && catX < 4) catX++;

  cat.style.transform = `translate(${catX * 100}%, ${catY * 100}%)`;
}

async function playProgram() {
  resetCatPositionOnly();

  for (const step of steps) {
    moveCat(step);
    await wait(500);
  }

  checkWin();
}

function checkWin() {
  if (catX === 4 && catY === 4) {
    setTimeout(() => {
      alert("Goed gedaan! De kat heeft de appel gevonden! 🍎");
    }, 300);
  }
}

function resetCatPositionOnly() {
  catX = 0;
  catY = 0;
  cat.style.transform = "translate(0%, 0%)";
}

function resetGame() {
  steps = [];
  renderSteps();
  resetCatPositionOnly();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
