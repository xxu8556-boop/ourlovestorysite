const togetherDate = new Date("2026-07-25T00:00:00+08:00");
const now = new Date();
const millisecondsPerDay = 1000 * 60 * 60 * 24;
const daysTogether = Math.max(1, Math.floor((now - togetherDate) / millisecondsPerDay) + 1);

document.querySelector("#daysTogether").textContent = daysTogether;

const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeButton = lightbox.querySelector(".lightbox-close");
const memoryButtons = document.querySelectorAll("[data-image]");

memoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.image;
    lightbox.showModal();
  });
});

closeButton.addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

const musicToggle = document.querySelector("#musicToggle");
const musicAudio = document.querySelector("#musicAudio");
const musicLabel = document.querySelector("#musicLabel");

function syncMusicButton() {
  const isPlaying = !musicAudio.paused;
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicLabel.textContent = isPlaying ? "暂停音乐" : "播放音乐";
}

musicToggle.addEventListener("click", async () => {
  if (musicAudio.paused) {
    try {
      await musicAudio.play();
    } catch (error) {
      musicLabel.textContent = "请点播放器";
    }
  } else {
    musicAudio.pause();
  }
});

musicAudio.addEventListener("play", syncMusicButton);
musicAudio.addEventListener("pause", syncMusicButton);
musicAudio.addEventListener("error", () => {
  musicToggle.classList.remove("is-playing");
  musicLabel.textContent = "音乐加载失败";
});

async function startMusicAfterInteraction() {
  if (!musicAudio.paused) return;

  try {
    await musicAudio.play();
  } catch (error) {
    musicLabel.textContent = "点我播放";
  }
}

musicAudio.play().catch(() => {
  musicLabel.textContent = "点一下开启音乐";
  document.addEventListener("click", startMusicAfterInteraction, { once: true });
  document.addEventListener("keydown", startMusicAfterInteraction, { once: true });
});
