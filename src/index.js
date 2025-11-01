import "./index.css";

const ICON = {
  summer: "./assets/icons/sun.svg",
  rainy: "./assets/icons/cloud-rain.svg",
  winter: "./assets/icons/cloud-snow.svg",
};

const mainBox = document.querySelector("#app");

const summerBox = document.createElement("div");
summerBox.classList.add("audio-box", "summer");
summerBox.style.backgroundImage = "url('./assets/summer-bg.jpg')";
summerBox.innerHTML = `<img src=${ICON.summer} />`;
mainBox.appendChild(summerBox);

const rainyBox = document.createElement("div");
rainyBox.classList.add("audio-box", "rainy");
rainyBox.style.backgroundImage = "url('./assets/rainy-bg.jpg')";
rainyBox.innerHTML = `<img src=${ICON.rainy} />`;
mainBox.appendChild(rainyBox);

const winterBox = document.createElement("div");
winterBox.classList.add("audio-box", "winter");
winterBox.style.backgroundImage = "url('./assets/winter-bg.jpg')";
winterBox.innerHTML = `<img src=${ICON.winter} />`;
mainBox.appendChild(winterBox);

let activeAudio = null;
let currentPlayingUrl = null;
let previousAudioBox = null;
let previousIconLink = null;

function playAudio(audioUrl, targetAudioBox, iconLink) {
  if (currentPlayingUrl !== audioUrl) {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      previousAudioBox.innerHTML = `<img src=${previousIconLink} />`;
    }

    fetch(audioUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const audioUrl = URL.createObjectURL(blob);
        activeAudio = new Audio(audioUrl);
        activeAudio.play();
      });
    currentPlayingUrl = audioUrl;
    targetAudioBox.innerHTML = `<img src="./assets/icons/pause.svg" />`;

    previousAudioBox = targetAudioBox;
    previousIconLink = iconLink;
  } else {
    if (activeAudio.paused) {
      activeAudio.play();
      targetAudioBox.innerHTML = `<img src="./assets/icons/pause.svg" />`;
    } else {
      activeAudio.pause();
      targetAudioBox.innerHTML = `<img src=${iconLink} />`;
    }
  }
}

mainBox.addEventListener("click", (event) => {
  const targetAudioBox = event.target.closest(".audio-box");
  switch (targetAudioBox) {
    case summerBox:
      playAudio("./assets/sounds/summer.mp3", targetAudioBox, ICON.summer);
      break;
    case rainyBox:
      playAudio("./assets/sounds/rain.mp3", targetAudioBox, ICON.rainy);
      break;
    case winterBox:
      playAudio("./assets/sounds/winter.mp3", targetAudioBox, ICON.winter);
      break;
    default:
      break;
  }
});
