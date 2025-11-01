import "./index.css";

const mainBox = document.querySelector("#app");

const summerBox = document.createElement("div");
summerBox.classList.add("audio-box", "summer");
summerBox.style.backgroundImage = "url('./assets/summer-bg.jpg')";
summerBox.innerHTML = `<img src="./assets/icons/sun.svg" />`;
mainBox.appendChild(summerBox);

const rainyBox = document.createElement("div");
rainyBox.classList.add("audio-box", "rainy");
rainyBox.style.backgroundImage = "url('./assets/rainy-bg.jpg')";
rainyBox.innerHTML = `<img src="./assets/icons/cloud-rain.svg" />`;
mainBox.appendChild(rainyBox);

const winterBox = document.createElement("div");
winterBox.classList.add("audio-box", "winter");
winterBox.style.backgroundImage = "url('./assets/winter-bg.jpg')";
winterBox.innerHTML = `<img src="./assets/icons/cloud-snow.svg" />`;
mainBox.appendChild(winterBox);

let activeAudio = null;
let currentPlayingUrl = null;

function playAudio(audioUrl) {
  if (currentPlayingUrl !== audioUrl) {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }

    fetch(audioUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const audioUrl = URL.createObjectURL(blob);
        activeAudio = new Audio(audioUrl);
        activeAudio.play();
      });
    currentPlayingUrl = audioUrl;
  } else {
    if (activeAudio.paused) {
      activeAudio.play();
    } else {
      activeAudio.pause();
    }
  }
}

mainBox.addEventListener("click", (event) => {
  switch (event.target.closest(".audio-box")) {
    case summerBox:
      playAudio("./assets/sounds/summer.mp3");
      break;
    case rainyBox:
      playAudio("./assets/sounds/rain.mp3");
      break;
    case winterBox:
      playAudio("./assets/sounds/winter.mp3");
      break;
    default:
      break;
  }
});
