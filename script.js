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

const shouldSkipIntro = sessionStorage.getItem("skipIntro") === "true";


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

function enterMainDirectly() {
  sessionStorage.removeItem("skipIntro");

  hasBootFinished = true;
  hasStarted = true;

  loadingScreen.classList.add("hide-loading");
  startScreen.classList.add("start-exit");
  mapScreen.classList.add("map-active");
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
MAP TARGET INTERACTION
Right-side UI buttons and map points both use data-section.
When a section is selected:
1. Find the matching map point.
2. Draw four lines from screen edges toward the point.
3. Zoom the map toward the point.
4. Open the target page.
*/

const mapWorld = document.getElementById("mapWorld");
const mapPoints = document.querySelectorAll(".map-point");
const targetLines = document.getElementById("targetLines");

let isOpeningSection = false;


// Find the map point that matches the selected section name.
function getMapPoint(sectionName) {
  return Array.from(mapPoints).find((point) => {
    return point.dataset.section === sectionName;
  });
}


// Update CSS variables so the four target lines know where to stop.
function updateTargetPosition(targetPoint) {
  const rect = targetPoint.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  mapScreen.style.setProperty("--target-x", `${centerX}px`);
  mapScreen.style.setProperty("--target-y", `${centerY}px`);

  mapScreen.style.setProperty("--target-left", `${rect.left}px`);
  mapScreen.style.setProperty("--target-right", `${rect.right}px`);
  mapScreen.style.setProperty("--target-top", `${rect.top}px`);
  mapScreen.style.setProperty("--target-bottom", `${rect.bottom}px`);

  // This makes the map zoom from the selected point.
  mapScreen.style.setProperty("--focus-x", `${centerX}px`);
  mapScreen.style.setProperty("--focus-y", `${centerY}px`);
}


// Highlight the selected right-side button and map point.
function setActiveSection(sectionName) {
  sectionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.section === sectionName);
  });

  mapPoints.forEach((point) => {
    point.classList.toggle("active", point.dataset.section === sectionName);
  });
}


// Main section opening animation.
async function openSection(sectionName) {
  if (isOpeningSection) return;

  const targetPoint = getMapPoint(sectionName);

  if (!targetPoint) {
    console.warn("No map point found for section:", sectionName);
    return;
  }

  isOpeningSection = true;

  closePortfolioMenu();
  setActiveSection(sectionName);
  updateTargetPosition(targetPoint);

  // Reset classes in case this animation has already been used.
  mapScreen.classList.remove("is-targeting", "is-focusing", "is-leaving");

  // Force browser to notice the reset before adding animation classes again.
  void mapScreen.offsetWidth;

  // Step 1: lines move from screen edges to the map point.
  mapScreen.classList.add("is-targeting");
  await delay(650);

  // Step 2: zoom the map toward the selected point.
  mapScreen.classList.add("is-focusing");
  await delay(850);

  // Step 3: fade out before opening the page.
  mapScreen.classList.add("is-leaving");
  await delay(450);

  const targetUrl = targetPoint.dataset.url || `${sectionName}.html`;

  window.location.href = targetUrl;
}


/* 
all event listeners are placed together here

*/

window.addEventListener("load", () => {
  if (shouldSkipIntro) {
    enterMainDirectly();
    return;
  }

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