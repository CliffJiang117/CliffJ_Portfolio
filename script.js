/* =========================================================
1. Loading screen boot text
2. Start screen enter interaction
3. Right-side navigation
4. Portfolio submenu open / close behavior
========================================================= */



const loadingScreen = document.getElementById("loading-screen");
const startScreen = document.getElementById("start-screen");
const mapScreen = document.getElementById("map-screen");
const codeLog = document.getElementById("code-log");

const portfolioGroup = document.getElementById("portfolioGroup");
const portfolioBtn = document.getElementById("portfolioBtn");
const portfolioSubmenu = document.getElementById("portfolioSubmenu");

const mainNavButtons = document.querySelectorAll(".right-nav > .nav-block");
const sectionButtons = document.querySelectorAll("[data-section]");


let hasBootFinished = false;
let hasStarted = false;


const bootLines = [
  "> initializing core...",
  "> loading archive...",
  "> map system online.",
  "> access granted."
];

//Pause the code for a certain amount of milliseconds.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


//Return a random number between min and max.
function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* 
Types fake terminal lines into #code-log, then hides the loading screen.

*/
async function typeBootSequence() {
  // if the code-log element is missing, skip the boot typing and enter the site directly.
  if (!codeLog || !loadingScreen) {
    hasBootFinished = true;
    return;
  }

  for (const line of bootLines) {
    for (const char of line) {
      codeLog.textContent += char;

      // Different characters get different typing delays.
      // makes the loading text feel more natural.
      if (char === ".") {
        await delay(randomDelay(80, 140));
      } else if (char === " ") {
        await delay(5);
      } else {
        await delay(randomDelay(10, 30));
      }
    }
    codeLog.textContent += "\n";

    // pause between boot lines.
    await delay(randomDelay(80, 180));
  }

  // pause after the final line.
  await delay(200);

  loadingScreen.classList.add("hide-loading");
  hasBootFinished = true;
}


/* 
START SCREEN
After the loading screen finishes, the user can click or press any key to enter the main map screen.
*/

function startWebsite() {
  // Do not start before loading is finished.
  if (!hasBootFinished) return;

  // Prevent the start animation from running more than once.
  if (hasStarted) return;

  hasStarted = true;

  startScreen.classList.add("start-exit");
  mapScreen.classList.add("map-active");
}


/* 
PORTFOLIO SUBMENU
Portfolio parent block and its child buttons.
*/

//Open or close the Portfolio submenu.
function togglePortfolioMenu() {
  const isOpen = portfolioGroup.classList.toggle("open");

  // Keep HTML accessibility state updated.
  portfolioBtn.setAttribute("aria-expanded", String(isOpen));
}


//Close the Portfolio submenu.
//Used when the user clicks About / CV / Contact.
function closePortfolioMenu() {
  portfolioGroup.classList.remove("open");
  portfolioBtn.setAttribute("aria-expanded", "false");
}


/* 
For now, this only logs the selected section.
Later, this should be replaced with real content switching.
*/

function openSection(sectionName) {
  console.log("Open section:", sectionName);

  // Future idea:
  // showContentPanel(sectionName);

}


/* 
all event listeners are placed together here

*/

window.addEventListener("load", () => {
  typeBootSequence();
});

document.addEventListener("keydown", startWebsite);
document.addEventListener("click", startWebsite);

portfolioBtn.addEventListener("click", (event) => {
  // Prevent this click from also triggering other document-level 
  // logic in future expansions.
  event.stopPropagation();

  togglePortfolioMenu();
});

mainNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closePortfolioMenu();
  });
});

sectionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sectionName = button.dataset.section;
    openSection(sectionName);
  });
});