/******************* Hero - lyd - kodet vi AI *******************/

const hero = document.querySelector(".hero");
const cta = document.querySelector(".hero-text .btn");
const soundtrack = document.querySelector("#soundtrack");

const fade = 3; // sekunder med overlap mellem de to spor

function fadeVolume(el, fra, til) {
  const start = Date.now();
  const id = setInterval(() => {
    const t = Math.min((Date.now() - start) / (fade * 1000), 1);
    el.volume = fra + (til - fra) * t;
    if (t === 1) clearInterval(id);
  }, 50);
}

function startLoop(forste) {
  const kopi = new Audio(forste.src);
  const spor = [forste, kopi];
  let aktiv = 0;

  forste.loop = false; // vi styrer selv loopet
  forste.volume = 1;

  setInterval(() => {
    const nu = spor[aktiv];
    const naeste = spor[1 - aktiv];

    if (nu.duration && nu.currentTime >= nu.duration - fade) {
      naeste.currentTime = 0;
      naeste.volume = 0;
      naeste.play();
      fadeVolume(nu, 1, 0);
      fadeVolume(naeste, 0, 1);
      aktiv = 1 - aktiv;
    }
  }, 250);

  forste.play();
}

if (hero && cta) {
  cta.addEventListener("click", () => {
    hero.classList.add("started");
    if (soundtrack) startLoop(soundtrack);
  });
}
/******************* Countdown *******************/

const countdownContent = document.querySelector(".countdown-content");

if (countdownContent) {
  const maal = new Date("2042-01-01T00:00:00").getTime();

  function pad(tal) {
    return String(tal).padStart(2, "0");
  }

  let interval;

  function opdater() {
    const diff = maal - Date.now();

    if (diff <= 0) {
      clearInterval(interval);
      countdownContent.textContent = "Tiden er gået!";
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
}

/******************* SVG - bevæger sig på linje - lært af Mikkel i undervisning *******************/

// const svgSpace = document.querySelector(".svg-space");

// const launch = document.querySelector("#details-launch");
// const crew = document.querySelector("#details-crew");
// const mars = document.querySelector("#details-mars");
// const exit = document.querySelector("#details-exit");
// const moons = document.querySelector("#details-moons");
// const earth = document.querySelector("#details-earth");

// if (svgSpace) {
//   launch.addEventListener("toggle", updateSVGPosition);
//   crew.addEventListener("toggle", updateSVGPosition);
//   mars.addEventListener("toggle", updateSVGPosition);
//   exit.addEventListener("toggle", updateSVGPosition);
//   moons.addEventListener("toggle", updateSVGPosition);
//   earth.addEventListener("toggle", updateSVGPosition);
// }

// function updateSVGPosition() {
//   const openDetails = document.querySelector(".accordion-item[open]");

//   if (openDetails) {
//     svgSpace.dataset.position = openDetails.dataset.position;
//   }
// }

/*************** SVG - bevæger på kurven - AI bot har udregnet alle punkter og sat det op (ingen CSS) ************/

const svgSpace = document.querySelector(".svg-space");
const rocket = document.querySelector(".rocket");

if (svgSpace && rocket) {
  /***  Det punkt på stien, hvor raketten er tegnet (SVG-koordinater) ****/
  const START = [457, 755];

  /**  Punkter raketten flyver igennem på vej til hvert stop (rækkefølgen = rejsen) ***/
  const legs = {
    launch: [],
    "crew-qa": [
      // jorden -> satellitten
      [448, 733],
      [435, 713],
      [419, 696],
      [400, 681],
      [380, 667],
      [361, 654],
      [344, 636],
      [331, 616],
      [323, 594],
      [318, 570],
      [317, 546],
      [318, 522],
      [320, 510],
    ],
    "mars-landing": [
      // satellitten -> Mars
      [335, 450],
      [384, 389],
      [420, 409],
      [463, 429],
      [509, 442],
      [556, 446],
      [603, 441],
      [648, 424],
      [687, 397],
      [721, 365],
      [754, 330],
      [789, 298],
      [827, 269],
      [867, 244],
      [910, 222],
      [954, 204],
      [999, 189],
      [1045, 177],
      [1092, 167],
      [1139, 160],
      [1195, 157],
    ],
    "exit-mars": [
      // hen over Mars til stien på højre side
      [1250, 150],
      [1320, 168],
      [1388, 183],
    ],
    "mars-moons": [
      // højre sti ned til månen
      [1440, 199],
      [1482, 221],
      [1521, 248],
      [1555, 282],
      [1582, 321],
      [1601, 365],
      [1609, 412],
      [1607, 459],
      [1594, 505],
      [1571, 547],
      [1538, 581],
      [1497, 606],
      [1452, 620],
      [1405, 625],
      [1357, 620],
      [1317, 609],
      [1255, 592],
    ],
    "earth-landing": [
      // månen -> tilbage til jorden
      [1200, 615],
      [1165, 634],
      [1117, 635],
      [1070, 645],
      [1049, 657],
      [1036, 677],
      [1035, 700],
      [1044, 723],
      [1055, 744],
      [1065, 765],
      [1073, 788],
      [1074, 811],
      [1067, 834],
      [1053, 852],
      [1034, 867],
      [992, 888],
      [946, 901],
      [899, 908],
      [851, 911],
      [804, 909],
      [757, 902],
      [711, 889],
      [667, 872],
      [630, 852],
      [565, 850],
    ],
  };

  // Byg én lang rute og husk hvor (afstand) hvert stop ligger
  const route = [START];
  const cum = [0]; // samlet afstand til hvert punkt
  const stopDistance = {};

  for (const [name, points] of Object.entries(legs)) {
    for (const p of points) {
      const last = route[route.length - 1];
      cum.push(
        cum[cum.length - 1] + Math.hypot(p[0] - last[0], p[1] - last[1]),
      );
      route.push(p);
    }
    stopDistance[name] = cum[cum.length - 1];
  }

  function pointAt(d) {
    for (let i = 1; i < route.length; i++) {
      if (d <= cum[i]) {
        const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
        return [
          route[i - 1][0] + (route[i][0] - route[i - 1][0]) * t,
          route[i - 1][1] + (route[i][1] - route[i - 1][1]) * t,
        ];
      }
    }
    return route[route.length - 1];
  }

  let current = 0; // hvor raketten er på ruten lige nu
  let frameId;

  function moveTo(target) {
    cancelAnimationFrame(frameId);
    const from = current;
    const duration = Math.max(600, Math.abs(target - from) * 4); // ms
    const t0 = performance.now();

    function frame(now) {
      const t = Math.min((now - t0) / duration, 2);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      current = from + (target - from) * eased;

      const [x, y] = pointAt(current);
      rocket.setAttribute(
        "transform",
        `translate(${x - START[0]} ${y - START[1]})`,
      );

      if (t < 1) frameId = requestAnimationFrame(frame);
    }
    frameId = requestAnimationFrame(frame);
  }

  document.querySelectorAll(".accordion-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      /*** Reagerer kun når et punkt åbnes, så raketten bliver stående hvis man lukker alle accordion elementer ***/
      if (!item.open) return;

      const target = stopDistance[item.dataset.position];
      if (target === undefined) {
        console.warn("Ukendt position:", item.dataset.position);
        return;
      }
      moveTo(target);
    });
  });
}

/**********  Light-mode / Dark-mode **************/

// const html = document.querySelector("html");
// const btn = document.querySelector("#theme-btn");

// function toggleTheme() {
//   html.classList.toggle("dark");
// }

// btn.addEventListener("click", toggleTheme);

/******************* OPSAMLING *******************/

const form = document.querySelector(".form-placeholder");

if (form) {
  function cancelPopup(event) {
    // Forhindr browserens valideringsboble
    event.preventDefault();
    form.querySelector(":invalid").focus();
  }

  form.addEventListener("invalid", cancelPopup, true);
}

const eventPass = document.querySelector(".pass-stage");

//vi opretter faste grupper til hvert crew, med gruppe-navn og planet
const groups = {
  grey: { group: "Magic Mercury Crew", planet: "./img/planeter/mercury.png" },
  pink: { group: "Vibrant Venus Crew", planet: "./img/venus.png" },
  green: { group: "Mortens Earth Crew", planet: "./img/planeter/earth.png" },
  red: { group: "Magnificent Mars Crew", planet: "./img/mars.png" },
  orange: {
    group: "Jubilant Jupiter Crew",
    planet: "./img/jupiter.png",
  },
  brown: { group: "Supreme Saturn Crew", planet: "./img/planeter/saturn.png" },
  blue: { group: "Unique Uranus Crew", planet: "./img/planeter/uranus.png" },
  purple: {
    group: "Noble Neptune Crew",
    planet: "./img/planeter/neptune.png",
  },
};

if (eventPass) {
  const nameOutput = document.querySelector(".name-output");
  const profileOutput = document.querySelector(".mission-profile-output");
  const groupOutput = document.querySelector(".group-output");
  const planetOutput = document.querySelector(".planet-output");
  const checkOne = document.querySelector(".check-one");
  const checkTwo = document.querySelector(".check-two");
  const checkThree = document.querySelector(".check-three");
  const checkFour = document.querySelector(".check-four");
  const checkFive = document.querySelector(".check-five");

  const params = new URLSearchParams(location.search);

  // Hent name  med params.get()
  const name = params.get("name");
  const profile = params.get("profile");
  const interests = params.getAll("interest");
  const color = params.get("color");

  // Vis værdi med textContent
  nameOutput.textContent = name;
  profileOutput.textContent = profile;
  checkOne.textContent = interests[0] || "No interests selected";
  checkTwo.textContent = interests[1] || "";
  checkThree.textContent = interests[2] || "";
  checkFour.textContent = interests[3] || "";
  checkFive.textContent = interests[4] || "";

  if (color) {
    eventPass.dataset.color = color;
    groupOutput.textContent = groups[color].group;
    planetOutput.src = groups[color].planet;
    planetOutput.alt = groups[color].group;
  }
}
