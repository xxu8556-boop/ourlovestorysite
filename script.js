const togetherDate = new Date("2026-07-25T00:00:00+08:00").getTime();
const loveCounter = document.querySelector("#loveCounter");
const counterParts = {
  days: document.querySelector("#daysTogether"),
  hours: document.querySelector("#hoursTogether"),
  minutes: document.querySelector("#minutesTogether"),
  seconds: document.querySelector("#secondsTogether")
};

function updateLoveCounter() {
  const totalSeconds = Math.floor(Math.max(0, Date.now() - togetherDate) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  counterParts.days.textContent = days;
  counterParts.hours.textContent = String(hours).padStart(2, "0");
  counterParts.minutes.textContent = String(minutes).padStart(2, "0");
  counterParts.seconds.textContent = String(seconds).padStart(2, "0");
  loveCounter.setAttribute("aria-label", `我们已经相爱 ${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`);
}

updateLoveCounter();
window.setInterval(updateLoveCounter, 1000);

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

// Keep the story readable without JavaScript or when the visitor prefers less motion.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const isMobileStory = window.matchMedia("(max-width: 820px)").matches;
  const revealSelectors = isMobileStory ? [
    ".first-impression", ".heartache-chapter", ".ambiguity-heading", ".ambiguity-story",
    ".different-chapter", ".rational-chapter", ".protective-chapter", ".falling-chapter",
    ".intro", ".timeline .moment", ".longing", ".after-us-heading", ".after-us-story",
    ".distance-heading", ".distance-grid", ".distance-divider", ".memories .section-heading",
    ".chat-gallery"
  ] : [
    ".first-impression-copy", ".first-chat-card", ".heartache-photo", ".heartache-copy",
    ".ambiguity-heading", ".ambiguity-story > *", ".different-chapter > *",
    ".rational-chapter > *", ".protective-chapter > *", ".falling-chapter > *",
    ".intro > *", ".timeline .moment", ".longing-copy", ".longing-chat",
    ".after-us-heading", ".after-us-copy", ".after-us-photo",
    ".distance-heading", ".distance-story", ".daily-message-intro",
    ".distance-photo", ".distance-divider", ".memories .section-heading",
    ".chat-card"
  ];
  const revealItems = document.querySelectorAll(revealSelectors.join(","));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

  revealItems.forEach((item) => {
    // Don't hide content already on screen, including when opening a chapter link.
    if (item.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    item.classList.add("scroll-reveal");
    revealObserver.observe(item);
  });
}
