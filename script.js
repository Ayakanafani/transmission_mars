// Interaktiv SVG-side
const svgPlaceholder = document.querySelector(".svg-placeholder");

// Opsamlingsside
const opsamlingPlaceholder = document.querySelector(".opsamling-placeholder");

if (opsamlingPlaceholder) {
  const params = new URLSearchParams(window.location.search);
  // Eksempel: params.get("navn") henter værdien fra et formularfelt med name="navn".
}

/******************* Hero *******************/

const hero = document.querySelector(".hero");
const cta = document.querySelector(".hero-text .btn");
const soundtrack = document.querySelector("#soundtrack");

cta.addEventListener("click", () => {
  hero.classList.add("started");
  soundtrack.play();
});

/******************* Countdown *******************/

const maal = new Date("2042-01-01T00:00:00").getTime();

function pad(tal) {
  return String(tal).padStart(2, "0");
}

let interval; // defineres først

function opdater() {
  const diff = maal - Date.now();

  if (diff <= 0) {
    clearInterval(interval);
    document.querySelector(".countdown-content").textContent = "Tiden er gået!";
    return;
  }

  const dage = Math.floor(diff / (1000 * 60 * 60 * 24));
  const timer = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const minutter = Math.floor(diff / (1000 * 60)) % 60;
  const sekunder = Math.floor(diff / 1000) % 60;

  document.getElementById("dage").textContent = pad(dage);
  document.getElementById("timer").textContent = pad(timer);
  document.getElementById("minutter").textContent = pad(minutter);
  document.getElementById("sekunder").textContent = pad(sekunder);
}

opdater();
interval = setInterval(opdater, 1000);

/******************* SVG *******************/

const svgSpace = document.querySelector(".svg-space");

const launch = document.querySelector("#details-launch");
const crew = document.querySelector("#details-crew");
const mars = document.querySelector("#details-mars");
const exit = document.querySelector("#details-exit");
const earth = document.querySelector("#details-earth");

launch.addEventListener("toggle", updateSVGPosition);
crew.addEventListener("toggle", updateSVGPosition);
mars.addEventListener("toggle", updateSVGPosition);
exit.addEventListener("toggle", updateSVGPosition);
earth.addEventListener("toggle", updateSVGPosition);

function updateSVGPosition() {
  const openDetails = document.querySelector(".accordion-item:open");

  if (openDetails) {
    svgSpace.dataset.position = openDetails.dataset.position;
  } else {
    delete svgSpace.dataset.position;
  }
}
