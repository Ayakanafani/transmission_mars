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
const cta = document.querySelector(".cta");
const soundtrack = document.querySelector("#soundtrack");

cta.addEventListener("click", () => {
  hero.classList.add("started");
  soundtrack.play();
});

/******************* Countdown *******************/

// Sæt din måldato her (år-måned-dagTtime:minut:sekund)
const maal = new Date("2042-01-01T00:00:00").getTime();

function pad(tal) {
  return String(tal).padStart(2, "0"); // 5 bliver til "05"
}

function opdater() {
  const diff = maal - Date.now();

  if (diff <= 0) {
    clearInterval(interval);
    document.getElementById("countdown").textContent = "Tiden er gået!";
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

opdater(); // kør med det samme, så der ikke går 1 sek. før noget vises
const interval = setInterval(opdater, 1000); // opdater hvert sekund
