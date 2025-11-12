import "./index.css";

import summerIcon from "../public/assets/icons/sun.svg";
import rainyIcon from "../public/assets/icons/cloud-rain.svg";
import winterIcon from "../public/assets/icons/cloud-snow.svg";
import pauseIcon from "../public/assets/icons/pause.svg";

import summerBg from "../public/assets/summer-bg.jpg";
import rainyBg from "../public/assets/rainy-bg.jpg";
import winterBg from "../public/assets/winter-bg.jpg";

import summerSound from "../public/assets/sounds/summer.mp3";
import rainSound from "../public/assets/sounds/rain.mp3";
import winterSound from "../public/assets/sounds/winter.mp3";

interface AudioElements {
  summer: HTMLDivElement;
  rainy: HTMLDivElement;
  winter: HTMLDivElement;
}

interface Resources {
  icons: {
    summer: string;
    rainy: string;
    winter: string;
    pause: string;
  };
  backgrounds: {
    summer: string;
    rainy: string;
    winter: string;
  };
  sounds: {
    summer: string;
    rainy: string;
    winter: string;
  };
}

const RESOURCES: Resources = {
  icons: {
    summer: summerIcon,
    rainy: rainyIcon,
    winter: winterIcon,
    pause: pauseIcon,
  },
  backgrounds: {
    summer: `url('${summerBg}')`,
    rainy: `url('${rainyBg}')`,
    winter: `url('${winterBg}')`,
  },
  sounds: {
    summer: summerSound,
    rainy: rainSound,
    winter: winterSound,
  },
};

let activeAudio: HTMLAudioElement | null = null;
let currentPlayingUrl: string | null = null;
let previousAudioBox: HTMLDivElement | null = null;
let previousIconLink: string | null = null;

function createAudioBox(
  type: keyof AudioElements,
  background: string,
  icon: string
): HTMLDivElement {
  const audioBox = document.createElement("div");
  audioBox.classList.add("audio-box", type);
  audioBox.style.backgroundImage = background;
  audioBox.innerHTML = `<img src="${icon}" alt="${type} sound" />`;
  return audioBox;
}

function playAudio(
  audioUrl: string,
  targetAudioBox: HTMLDivElement,
  iconLink: string,
  backgroundImage: string
): void {
  if (currentPlayingUrl !== audioUrl) {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      if (previousAudioBox) {
        previousAudioBox.innerHTML = `<img src="${previousIconLink}" alt="audio icon" />`;
      }
    }

    fetch(audioUrl)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob: Blob) => {
        const audioObjectUrl = URL.createObjectURL(blob);
        activeAudio = new Audio(audioObjectUrl);

        activeAudio.addEventListener("ended", () => {
          if (previousAudioBox) {
            previousAudioBox.innerHTML = `<img src="${previousIconLink}" alt="audio icon" />`;
          }
          currentPlayingUrl = null;
        });

        return activeAudio.play();
      })
      .then(() => {
        currentPlayingUrl = audioUrl;
        targetAudioBox.innerHTML = `<img src="${RESOURCES.icons.pause}" alt="pause" />`;
        document.body.style.backgroundImage = backgroundImage;

        previousAudioBox = targetAudioBox;
        previousIconLink = iconLink;
      })
      .catch((error: Error) => {
        console.error("Error playing audio:", error);
      });
  } else {
    if (activeAudio) {
      if (activeAudio.paused) {
        activeAudio
          .play()
          .then(() => {
            targetAudioBox.innerHTML = `<img src="${RESOURCES.icons.pause}" alt="pause" />`;
          })
          .catch((error: Error) => {
            console.error("Error resuming audio:", error);
          });
      } else {
        activeAudio.pause();
        targetAudioBox.innerHTML = `<img src="${iconLink}" alt="audio icon" />`;
      }
    }
  }
}

function handleAudioBoxClick(event: Event): void {
  const target = event.target as HTMLElement;
  const targetAudioBox = target.closest(".audio-box") as HTMLDivElement;

  if (!targetAudioBox) return;

  const audioElements: AudioElements = {
    summer: summerBox,
    rainy: rainyBox,
    winter: winterBox,
  };

  let audioType: keyof AudioElements | null = null;
  for (const type in audioElements) {
    if (audioElements[type as keyof AudioElements] === targetAudioBox) {
      audioType = type as keyof AudioElements;
      break;
    }
  }

  if (!audioType) return;

  playAudio(
    RESOURCES.sounds[audioType],
    targetAudioBox,
    RESOURCES.icons[audioType],
    RESOURCES.backgrounds[audioType]
  );
}

function setupVolumeControl(): void {
  const volumeControl = document.createElement("div");
  volumeControl.className = "volume-control";
  volumeControl.innerHTML = `<input type="range" id="volume" min="0" max="100" value="50" />`;

  mainBox.appendChild(volumeControl);

  const volumeSlider = document.getElementById("volume") as HTMLInputElement;
  const volumeValue = document.getElementById(
    "volume-value"
  ) as HTMLSpanElement;

  volumeSlider.addEventListener("input", (event: Event) => {
    const target = event.target as HTMLInputElement;
    const volume = parseInt(target.value) / 100;

    if (volumeValue) {
      volumeValue.textContent = `${target.value}%`;
    }

    if (activeAudio) {
      activeAudio.volume = volume;
    }
  });
}

document.body.style.backgroundImage = RESOURCES.backgrounds.summer;
const mainBox = document.querySelector("#app") as HTMLDivElement;

if (!mainBox) {
  throw new Error("Main app container not found");
}

const audioManager = document.createElement("div");
audioManager.className = "audio-manager";
mainBox.appendChild(audioManager);

const summerBox = createAudioBox(
  "summer",
  RESOURCES.backgrounds.summer,
  RESOURCES.icons.summer
);
audioManager.appendChild(summerBox);

const rainyBox = createAudioBox(
  "rainy",
  RESOURCES.backgrounds.rainy,
  RESOURCES.icons.rainy
);
audioManager.appendChild(rainyBox);

const winterBox = createAudioBox(
  "winter",
  RESOURCES.backgrounds.winter,
  RESOURCES.icons.winter
);
audioManager.appendChild(winterBox);

mainBox.addEventListener("click", handleAudioBoxClick);

setupVolumeControl();

window.addEventListener("beforeunload", () => {
  if (activeAudio) {
    activeAudio.pause();

    if (activeAudio.src.startsWith("blob:")) {
      URL.revokeObjectURL(activeAudio.src);
    }
  }
});
