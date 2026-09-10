const characters = {
  cat: { name: "Kat", icon: "assets/icons/cat.svg", sound: "Miauw!", spoken: "miauw" },
  robot: { name: "Robot", icon: "assets/icons/robot.svg", sound: "Biep!", spoken: "biep" },
  unicorn: { name: "Eenhoorn", icon: "assets/icons/unicorn.svg", sound: "Sparkle!", spoken: "sparkle" }
};

const blockLibrary = {
  up: { icon: "assets/icons/arrow-up.svg", label: "omhoog", code: ["omhoog()"] },
  down: { icon: "assets/icons/arrow-down.svg", label: "omlaag", code: ["omlaag()"] },
  left: { icon: "assets/icons/arrow-left.svg", label: "links", code: ["links()"] },
  right: { icon: "assets/icons/arrow-right.svg", label: "rechts", code: ["rechts()"] },
  repeatRight: { icon: "assets/icons/repeat-right.svg", label: "4x rechts", kind: "smart", code: ["rechts()", "rechts()", "rechts()", "rechts()"] },
  repeatDown: { icon: "assets/icons/repeat-down.svg", label: "4x omlaag", kind: "smart", code: ["omlaag()", "omlaag()", "omlaag()", "omlaag()"] },
  talk: { icon: "assets/icons/sound.svg", label: "praat", kind: "fun", code: ["praat()"] },
  dance: { icon: "assets/icons/dance.svg", label: "dans", kind: "fun", code: ["dans()"] },
  play: { icon: "assets/icons/play.svg", label: "play", kind: "play", code: [] }
};

const levels = [
  {
    icon: "🐾", title: "Volgorde", lesson: "Code gaat stap voor stap.",
    start: { x: 0, y: 0 }, goal: { x: 4, y: 4 }, maxSteps: 8,
    walls: [], lava: [], water: [], stars: [], mustUse: [], mustCollectStar: false,
    blocks: ["right", "down", "left", "up", "play"],
    hint: "Ga naar rechts en daarna omlaag."
  },
  {
    icon: "🔁", title: "Herhalen", lesson: "Herhaling maakt code korter.",
    start: { x: 0, y: 0 }, goal: { x: 4, y: 4 }, maxSteps: 2,
    walls: [], lava: [], water: [], stars: [], mustUse: ["repeatRight", "repeatDown"], mustCollectStar: false,
    blocks: ["repeatRight", "repeatDown", "right", "down", "play"],
    hint: "Eén herhaalblok doet vier stappen."
  },
  {
    icon: "🔥", title: "Debuggen", lesson: "Foutje? Kijk en verbeter.",
    start: { x: 0, y: 0 }, goal: { x: 4, y: 4 }, maxSteps: 8,
    walls: [], lava: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 2 }], water: [], stars: [], mustUse: [], mustCollectStar: false,
    blocks: ["right", "down", "left", "up", "play"],
    hint: "Onderlangs is veilig."
  },
  {
    icon: "🎭", title: "Acties", lesson: "Code kan iets laten gebeuren.",
    start: { x: 0, y: 0 }, goal: { x: 3, y: 3 }, maxSteps: 10,
    walls: [{ x: 2, y: 1 }, { x: 1, y: 2 }], lava: [], water: [], stars: [], mustUse: ["talk", "dance"], mustCollectStar: false,
    blocks: ["right", "down", "talk", "dance", "play"],
    hint: "Gebruik ook praat en dans."
  },
  {
    icon: "⌨️", title: "Blokjes worden code", lesson: "Een blokje kan een coderegel zijn.",
    start: { x: 0, y: 0 }, goal: { x: 2, y: 2 }, maxSteps: 6,
    walls: [], lava: [], water: [], stars: [], mustUse: ["talk"], mustCollectStar: false,
    blocks: ["right", "down", "talk", "dance", "play"],
    hint: "Kijk naar Mijn blokjes als code."
  },
  {
    icon: "⭐", title: "Eerst de ster", lesson: "Soms moet je eerst iets verzamelen.",
    start: { x: 0, y: 0 }, goal: { x: 4, y: 4 }, maxSteps: 9,
    walls: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 3 }], lava: [], water: [], stars: [{ x: 4, y: 0 }], mustUse: [], mustCollectStar: true,
    blocks: ["right", "down", "left", "up", "play"],
    hint: "Pak eerst de ster bovenin."
  }
];

const $ = (id) => document.getElementById(id);
const screens = {
  start: $("screen-start"),
  explain: $("screen-explain"),
  levels: $("screen-levels"),
  game: $("screen-game"),
  code: $("screen-code")
};

let childName = "";
let selectedCharacter = "cat";
let currentLevelIndex = 0;
let program = [];
let player = { x: 0, y: 0 };
let codePlayer = { x: 0, y: 0 };
let codeScenario = { start: { x: 0, y: 0 }, goal: { x: 4, y: 4 }, walls: [], lava: [], water: [], stars: [] };
let collectedStar = false;
let isRunning = false;
let codeRunning = false;

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
}

function readName() {
  childName = $("child-name").value.trim().replace(/\s+/g, " ");
  return childName;
}

function requireName() {
  const name = readName();
  const panel = document.querySelector(".name-panel");
  const hint = $("name-hint");
  if (!name) {
    panel.classList.add("is-error");
    hint.textContent = "Typ eerst je naam. Dan kan de app tegen jou praten.";
    $("child-name").focus();
    return false;
  }
  panel.classList.remove("is-error");
  hint.textContent = `Hoi ${name}. Kies wat je wilt doen.`;
  updatePersonalCopy();
  return true;
}

function updatePersonalCopy() {
  const name = childName || "programmeur";
  $("levels-title").textContent = `${name}, kies een level`;
  $("explain-title").textContent = `${name}, zo werkt code`;
  $("explain-line").textContent = `${name}, de computer leest jouw code van boven naar beneden.`;
  $("code-title").textContent = `${name}, schrijf je eerste code`;
}

function currentCharacter() {
  return characters[selectedCharacter];
}

function setCharacter(key) {
  selectedCharacter = key;
  const character = currentCharacter();
  $("character-name").textContent = character.name;
  document.querySelectorAll(".character-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.character === key);
  });
  $("player").src = character.icon;
  $("code-player").src = character.icon;
}

function setupStart() {
  $("child-name").addEventListener("input", () => {
    readName();
    document.querySelector(".name-panel").classList.remove("is-error");
    $("name-hint").textContent = childName ? `Hoi ${childName}. Kies wat je wilt doen.` : "Dan kan de app jou persoonlijk uitleg geven.";
    updatePersonalCopy();
  });

  $("child-name").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && requireName()) {
      renderLevels();
      showScreen("levels");
    }
  });

  document.querySelectorAll(".character-button").forEach((button) => {
    button.addEventListener("click", () => setCharacter(button.dataset.character));
  });

  $("start-levels").addEventListener("click", () => {
    if (requireName()) {
      renderLevels();
      showScreen("levels");
    }
  });

  $("start-code").addEventListener("click", () => {
    if (requireName()) openCodeLab();
  });

  $("start-explain").addEventListener("click", () => {
    if (requireName()) showScreen("explain");
  });

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.go));
  });
}

function setupExplain() {
  $("read-explain").addEventListener("click", speakExplanation);
  $("stop-explain").addEventListener("click", stopSpeaking);
  $("explain-to-code").addEventListener("click", openCodeLab);
  $("levels-to-explain").addEventListener("click", () => showScreen("explain"));
}

function speakExplanation() {
  const name = childName || readName() || "programmeur";
  const text = [
    `Hoi ${name}. Ik leg uit hoe coderen werkt.`,
    "Code is een plan voor de computer.",
    "De computer leest jouw code van boven naar beneden.",
    "Eén regel code doet één ding.",
    "Rechts met haakjes betekent: ga één stap naar rechts.",
    "Omlaag met haakjes betekent: ga één stap omlaag.",
    "De volgorde is belangrijk.",
    "Foutjes zijn normaal.",
    "Dan verander je één stukje en probeer je opnieuw.",
    "Dat heet debuggen."
  ].join(" ");
  speak(text, 0.9, 1.2);
}

function speak(text, rate = 1, pitch = 1.2) {
  if (!("speechSynthesis" in window)) {
    alert("Voorlezen werkt niet in deze browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "nl-NL";
  voice.rate = rate;
  voice.pitch = pitch;
  window.speechSynthesis.speak(voice);
}

function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function renderLevels() {
  const list = $("level-list");
  list.innerHTML = "";
  levels.forEach((level, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "level-card";
    card.innerHTML = `
      <span class="level-icon">${level.icon}</span>
      <span><strong>Level ${index + 1}: ${level.title}</strong><span>${level.lesson}</span></span>
      <em>${level.maxSteps} blokjes</em>
    `;
    card.addEventListener("click", () => loadLevel(index));
    list.appendChild(card);
  });
}

function loadLevel(index) {
  currentLevelIndex = index;
  const level = levels[index];
  $("level-kicker").textContent = `Level ${index + 1}`;
  $("level-title").textContent = `${level.icon} ${level.title}`;
  $("lesson-text").textContent = level.lesson;
  $("player").src = currentCharacter().icon;
  program = [];
  resetLevelState();
  renderGrid($("grid"), level);
  renderBlockBar(level);
  renderProgram();
  hideGameFeedback();
  showScreen("game");
}

function currentLevel() {
  return levels[currentLevelIndex];
}

function resetLevelState() {
  const level = currentLevel();
  player = { ...level.start };
  collectedStar = false;
  updatePlayerPosition($("player"), player);
  moveBubble($("speech-bubble"), player);
  hideBubble($("speech-bubble"));
  $("confetti").classList.add("is-hidden");
}

function renderGrid(grid, level, codeMode = false) {
  grid.style.setProperty("--cell", `${100 / 5}%`);
  grid.querySelectorAll(".cell").forEach((cell) => cell.remove());
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const cell = document.createElement("div");
      cell.className = `cell ${tileClass(level, x, y)}`;
      cell.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
      grid.appendChild(cell);
    }
  }
  const goal = codeMode ? $("code-goal") : $("goal");
  const goalX = `${level.goal.x * 100}%`;
  const goalY = `${level.goal.y * 100}%`;
  goal.style.setProperty("--goal-x", goalX);
  goal.style.setProperty("--goal-y", goalY);
  goal.style.transform = `translate(${goalX}, ${goalY})`;
}

function tileClass(level, x, y) {
  if (has(level.walls, x, y)) return "wall";
  if (has(level.lava, x, y)) return "lava";
  if (has(level.water, x, y)) return "water";
  if (has(level.stars, x, y) && !collectedStar) return "star";
  return "path";
}

function renderBlockBar(level) {
  const bar = $("block-bar");
  bar.innerHTML = "";
  level.blocks.forEach((name) => {
    const block = blockLibrary[name];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `block-button ${block.kind || ""}`;
    button.innerHTML = `<img src="${block.icon}" alt="" />${block.label}`;
    button.addEventListener("click", () => name === "play" ? playProgram() : addBlock(name));
    bar.appendChild(button);
  });
}

function addBlock(name) {
  if (isRunning) return;
  if (program.length >= currentLevel().maxSteps) {
    showGameFeedback("warning", "Vol", "Druk op play of maak leeg.");
    return;
  }
  program.push(name);
  renderProgram();
  hideGameFeedback();
}

function renderProgram() {
  $("step-count").textContent = `${program.length}/${currentLevel().maxSteps}`;
  const tray = $("program-tray");
  tray.innerHTML = "";
  if (program.length === 0) {
    tray.innerHTML = `<span class="empty-state">Tik blokjes.</span>`;
  } else {
    program.forEach((name) => {
      const block = blockLibrary[name];
      const item = document.createElement("span");
      item.className = "program-step";
      item.innerHTML = `<img src="${block.icon}" alt="" />${block.label}`;
      tray.appendChild(item);
    });
  }
  renderTranslatedCode();
}

function blocksToCode() {
  return program.flatMap((name) => blockLibrary[name].code);
}

function renderTranslatedCode() {
  const code = blocksToCode();
  $("translated-code").textContent = code.length ? code.join("\n") : "// Kies eerst blokjes";
  $("send-to-code").disabled = code.length === 0;
}

async function playProgram() {
  if (isRunning || program.length === 0) return;
  isRunning = true;
  resetLevelState();
  hideGameFeedback();
  await wait(120);
  for (const block of program) {
    if (isAtGoal(player, currentLevel().goal)) break;
    await runBlock(block);
    if (await checkTileTrouble()) {
      isRunning = false;
      return;
    }
    checkCollectibles();
    if (isAtGoal(player, currentLevel().goal)) break;
  }
  finishProgram();
  isRunning = false;
}

async function runBlock(block) {
  if (block === "repeatRight") return repeatMove("right");
  if (block === "repeatDown") return repeatMove("down");
  if (block === "talk") return talk($("speech-bubble"));
  if (block === "dance") return dance($("player"));
  movePlayer(block);
  await wait(280);
}

async function repeatMove(direction) {
  for (let i = 0; i < 4; i++) {
    if (isAtGoal(player, currentLevel().goal)) return;
    movePlayer(direction);
    await wait(220);
    if (await checkTileTrouble()) return;
    checkCollectibles();
  }
}

function movePlayer(direction) {
  const next = { ...player };
  if (direction === "up") next.y--;
  if (direction === "down") next.y++;
  if (direction === "left") next.x--;
  if (direction === "right") next.x++;
  if (isBlocked(next, currentLevel())) {
    bump($("player"), player);
    return;
  }
  player = next;
  updatePlayerPosition($("player"), player);
  moveBubble($("speech-bubble"), player);
}

function isBlocked(pos, level) {
  return pos.x < 0 || pos.y < 0 || pos.x > 4 || pos.y > 4 || has(level.walls, pos.x, pos.y);
}

async function checkTileTrouble() {
  const level = currentLevel();
  if (has(level.lava, player.x, player.y)) {
    showGameFeedback("soft-error", "Oeps", "Lava! Probeer een andere route.");
    program = [];
    renderProgram();
    resetLevelState();
    return true;
  }
  return false;
}

function checkCollectibles() {
  const level = currentLevel();
  if (has(level.stars, player.x, player.y) && !collectedStar) {
    collectedStar = true;
    renderGrid($("grid"), level);
    say($("speech-bubble"), "Ster!");
  }
}

function finishProgram() {
  const level = currentLevel();
  if (!isAtGoal(player, level.goal)) {
    showGameFeedback("warning", "Bijna", "Kijk wat er gebeurde. Verander één stukje.");
    return;
  }
  if (level.mustCollectStar && !collectedStar) {
    showGameFeedback("warning", "Ster vergeten", "Pak eerst de ster en probeer opnieuw.");
    return;
  }
  const missing = level.mustUse.filter((name) => !program.includes(name));
  if (missing.length) {
    showGameFeedback("warning", "Nog iets", `Gebruik ook ${blockLibrary[missing[0]].label}.`);
    return;
  }
  showGameFeedback("success", "Gelukt!", `Goed gedaan ${childName}. Je programma werkt.`);
  $("confetti").classList.remove("is-hidden");
}

function showGameFeedback(type, title, text) {
  const card = $("game-feedback");
  card.className = `feedback-card glass-card ${type}`;
  $("game-feedback-title").textContent = title;
  $("game-feedback-text").textContent = text;
}

function hideGameFeedback() {
  $("game-feedback").className = "feedback-card glass-card is-hidden";
}

function nextLevel() {
  const next = currentLevelIndex + 1;
  if (next < levels.length) loadLevel(next);
  else showScreen("levels");
}

function clearProgram() {
  if (isRunning) return;
  program = [];
  renderProgram();
  hideGameFeedback();
  resetLevelState();
}

function setupGame() {
  $("reset-level").addEventListener("click", () => {
    if (!isRunning) {
      resetLevelState();
      hideGameFeedback();
    }
  });
  $("clear-program").addEventListener("click", clearProgram);
  $("next-level").addEventListener("click", nextLevel);
  $("send-to-code").addEventListener("click", () => {
    const code = blocksToCode();
    if (code.length) openCodeLab(code.join("\n"), currentLevel());
  });
  $("levels-to-code").addEventListener("click", openCodeLab);
}

function openCodeLab(prefill, scenario) {
  if (!childName) readName();
  updatePersonalCopy();
  codeScenario = scenario
    ? { start: { ...scenario.start }, goal: { ...scenario.goal }, walls: scenario.walls || [], lava: scenario.lava || [], water: scenario.water || [], stars: [] }
    : { start: { x: 0, y: 0 }, goal: { x: 4, y: 4 }, walls: [], lava: [], water: [], stars: [] };
  $("code-player").src = currentCharacter().icon;
  renderGrid($("code-grid"), codeScenario, true);
  if (typeof prefill === "string") $("code-editor").value = prefill;
  resetCodeRunner(false);
  showScreen("code");
}

function resetCodeRunner(clearFeedback = true) {
  codePlayer = { ...codeScenario.start };
  updatePlayerPosition($("code-player"), codePlayer);
  moveBubble($("code-bubble"), codePlayer);
  hideBubble($("code-bubble"));
  if (clearFeedback) hideCodeFeedback();
  updateLineCount();
}

function setupCodeLab() {
  $("reset-code").addEventListener("click", () => resetCodeRunner());
  $("example-code").addEventListener("click", () => {
    $("code-editor").value = "rechts()\nrechts()\nrechts()\nrechts()\nomlaag()\nomlaag()\nomlaag()\nomlaag()";
    updateLineCount();
    $("code-editor").focus();
  });
  $("run-code").addEventListener("click", runCode);
  $("code-explain").addEventListener("click", speakExplanation);
  $("code-editor").addEventListener("input", updateLineCount);
  document.querySelectorAll("[data-insert]").forEach((button) => {
    button.addEventListener("click", () => insertCodeLine(button.dataset.insert));
  });
}

function insertCodeLine(line) {
  const editor = $("code-editor");
  const value = editor.value.trimEnd();
  editor.value = value ? `${value}\n${line}` : line;
  updateLineCount();
  editor.focus();
}

function codeLines() {
  return $("code-editor").value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function updateLineCount() {
  $("line-count").textContent = `${codeLines().length}/10`;
}

function parseCode() {
  const allowed = {
    "rechts()": "right",
    "links()": "left",
    "omhoog()": "up",
    "omlaag()": "down",
    "praat()": "talk",
    "dans()": "dance"
  };
  const lines = codeLines();
  if (!lines.length) return { ok: false, message: "Typ eerst een regel code." };
  if (lines.length > 10) return { ok: false, message: "Gebruik maximaal 10 regels." };
  const commands = [];
  for (let i = 0; i < lines.length; i++) {
    if (!allowed[lines[i]]) return { ok: false, message: `Regel ${i + 1} snap ik nog niet.` };
    commands.push(allowed[lines[i]]);
  }
  return { ok: true, commands };
}

async function runCode() {
  if (codeRunning) return;
  const parsed = parseCode();
  if (!parsed.ok) {
    showCodeFeedback("warning", "Check je code", parsed.message);
    return;
  }
  codeRunning = true;
  codePlayer = { ...codeScenario.start };
  updatePlayerPosition($("code-player"), codePlayer);
  moveBubble($("code-bubble"), codePlayer);
  hideBubble($("code-bubble"));
  renderGrid($("code-grid"), codeScenario, true);
  hideCodeFeedback();
  await wait(120);
  for (const command of parsed.commands) {
    if (isAtGoal(codePlayer, codeScenario.goal)) break;
    if (command === "talk") await talk($("code-bubble"));
    else if (command === "dance") await dance($("code-player"));
    else {
      moveCodePlayer(command);
      await wait(280);
    }
  }
  if (isAtGoal(codePlayer, codeScenario.goal)) {
    showCodeFeedback("success", "Gelukt!", `${childName}, je hebt echte code geschreven.`);
  } else {
    showCodeFeedback("warning", "Bijna", "Je code werkt, maar je bent nog niet bij de vis.");
  }
  codeRunning = false;
}

function moveCodePlayer(direction) {
  const next = { ...codePlayer };
  if (direction === "up") next.y--;
  if (direction === "down") next.y++;
  if (direction === "left") next.x--;
  if (direction === "right") next.x++;
  if (next.x < 0 || next.y < 0 || next.x > 4 || next.y > 4 || has(codeScenario.walls, next.x, next.y)) {
    bump($("code-player"), codePlayer);
    return;
  }
  codePlayer = next;
  updatePlayerPosition($("code-player"), codePlayer);
  moveBubble($("code-bubble"), codePlayer);
}

function showCodeFeedback(type, title, text) {
  const card = $("code-feedback");
  card.className = `feedback-card glass-card ${type}`;
  $("code-feedback-title").textContent = title;
  $("code-feedback-text").textContent = text;
}

function hideCodeFeedback() {
  $("code-feedback").className = "feedback-card glass-card is-hidden";
}

async function talk(bubble) {
  const character = currentCharacter();
  await say(bubble, character.sound);
  speak(character.spoken, 1.12, 1.6);
}

async function say(bubble, text) {
  bubble.textContent = text;
  bubble.classList.remove("is-hidden");
  await wait(520);
  hideBubble(bubble);
}

function hideBubble(bubble) {
  bubble.classList.add("is-hidden");
}

async function dance(sprite) {
  sprite.classList.add("is-dancing");
  await wait(540);
  sprite.classList.remove("is-dancing");
}

function updatePlayerPosition(sprite, position) {
  sprite.style.transform = `translate(${position.x * 100}%, ${position.y * 100}%)`;
}

function moveBubble(bubble, position) {
  bubble.style.transform = `translate(${position.x * 100}%, ${position.y * 100}%)`;
}

function bump(sprite, position) {
  sprite.animate([
    { transform: `translate(${position.x * 100}%, ${position.y * 100}%) rotate(0deg)` },
    { transform: `translate(${position.x * 100}%, ${position.y * 100}%) rotate(-8deg)` },
    { transform: `translate(${position.x * 100}%, ${position.y * 100}%) rotate(8deg)` },
    { transform: `translate(${position.x * 100}%, ${position.y * 100}%) rotate(0deg)` }
  ], { duration: 220, iterations: 1 });
}

function has(list, x, y) {
  return list.some((item) => item.x === x && item.y === y);
}

function isAtGoal(position, goal) {
  return position.x === goal.x && position.y === goal.y;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

setupStart();
setupExplain();
setupGame();
setupCodeLab();
setCharacter("cat");
renderLevels();
renderGrid($("code-grid"), codeScenario, true);
resetCodeRunner();
showScreen("start");
