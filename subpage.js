const returnMainBtn = document.getElementById("returnMainBtn");

const portfolioGroup = document.getElementById("portfolioGroup");
const portfolioBtn = document.getElementById("portfolioBtn");

const pageButtons = document.querySelectorAll("[data-url]");

if (returnMainBtn) {
  returnMainBtn.addEventListener("click", () => {
    sessionStorage.setItem("skipIntro", "true");
    window.location.href = "index.html";
  });
}

if (portfolioBtn && portfolioGroup) {
  portfolioBtn.addEventListener("click", () => {
    const isOpen = portfolioGroup.classList.toggle("open");
    portfolioBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

pageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetUrl = button.dataset.url;

    if (!targetUrl) return;

    window.location.href = targetUrl;
  });
});