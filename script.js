const loadingScreen = document.getElementById("loading-screen");
const startScreen = document.getElementById("start-screen");
const codeLog = document.getElementById("code-log");
const mapScreen = document.getElementById("map-screen");

let hasStarted = false;

/*const bootLines = [
  "> initializing portfolio_core...",
  "> loading project_archive...",
  "> syncing visual_interface...",
  "> scanning interaction_nodes...",
  "> compiling map_data...",
  "> calibrating player_marker...",
  "> system online."
];*/
const bootLines = [
  "> initializing core...",
  "> loading archive...",
  "> map system online.",
  "> access granted."
];

async function typeBootSequence() {

  for (const line of bootLines) {

    for (const char of line) {

        codeLog.textContent += char;

        if (char === ".") {
            await delay(randomDelay(80, 140));
        }
        else if (char === " ") {
            await delay(5);
        }
        else {
            await delay(randomDelay(10, 30));
        }
    }

    // new line after each boot line
    codeLog.textContent += "\n";

    // delay between lines
    await delay(randomDelay(80, 180));
  }

  // delay longer after the final line before showing the start screen
  await delay(200);

  loadingScreen.classList.add("hide-loading");
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener("load", () => {
  typeBootSequence();
});

function startWebsite() {
  if (hasStarted) return;

  hasStarted = true;

  setTimeout(() => {
    startScreen.classList.add("start-exit");
    mapScreen.classList.add("map-active");
  }, 1000);
}

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener("keydown", startWebsite);
document.addEventListener("click", startWebsite);