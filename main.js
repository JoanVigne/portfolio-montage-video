// Configuration des plateformes supportées
const PLATFORMS = {
  youtube: {
    pattern: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    getThumbnail: (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    hasModal: true,
  },
  "youtube-short": {
    pattern: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?&]+)/,
    getThumbnail: (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    hasModal: true,
  },
  instagram: {
    pattern: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/reel\/([^/?&]+)/,
    getThumbnail: () => "assets/insta.png",
    hasModal: false,
  },
};

// Utilitaire pour extraire les informations vidéo
function extractVideoInfo(videoLink) {
  for (const [platformName, config] of Object.entries(PLATFORMS)) {
    const match = videoLink.match(config.pattern);
    if (match) {
      return {
        id: match[1],
        platform: platformName,
        thumbnailUrl: config.getThumbnail(match[1]),
        hasModal: config.hasModal,
      };
    }
  }
  return null;
}

// Utilitaire pour obtenir tous les vidéos triés par date
function getAllVideosSorted() {
  const allVideos = [];
  for (const videoType in videos) {
    for (const videoId in videos[videoType]) {
      allVideos.push({ ...videos[videoType][videoId], type: videoType });
    }
  }
  return allVideos.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Création du modal pour YouTube
function createModal(videoId, platform) {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  iframe.width = "560";
  iframe.height = "315";
  iframe.frameBorder = "0";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.classList.add(platform === "youtube-short" ? "short" : "youtube");

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.classList.add("close-button");

  modalContent.appendChild(iframe);
  modalContent.appendChild(closeButton);
  modalOverlay.appendChild(modalContent);

  // Gestionnaires d'événements pour fermer le modal
  const closeModal = () => {
    if (document.body.contains(modalOverlay)) {
      document.body.removeChild(modalOverlay);
      document.removeEventListener("keydown", handleKeyDown);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") closeModal();
  };

  modalOverlay.addEventListener("click", closeModal);
  closeButton.addEventListener("click", closeModal);
  document.addEventListener("keydown", handleKeyDown);

  document.body.appendChild(modalOverlay);
}

// Création d'un élément vidéo
function createVideoItem(video) {
  const videoItem = document.createElement("div");
  videoItem.classList.add("video-item");

  const videoInfo = extractVideoInfo(video.link);
  if (!videoInfo) return videoItem;

  const { id, platform, thumbnailUrl, hasModal } = videoInfo;

  // Création de la miniature
  const thumbnailImage = document.createElement("img");
  thumbnailImage.src = thumbnailUrl;
  thumbnailImage.alt = video.title;
  thumbnailImage.classList.add("video-thumbnail");

  if (hasModal) {
    // Pour YouTube: modal au clic
    thumbnailImage.addEventListener("click", (event) => {
      event.preventDefault();
      createModal(id, platform);
    });
    videoItem.appendChild(thumbnailImage);
  } else {
    // Pour Instagram: lien direct
    const thumbnailLink = document.createElement("a");
    thumbnailLink.href = video.link;
    thumbnailLink.target = "_blank";
    thumbnailImage.alt = "";
    thumbnailLink.rel = "noopener noreferrer";
    thumbnailLink.appendChild(thumbnailImage);
    videoItem.appendChild(thumbnailLink);
  }

  // Création du lien titre
  const videoLinkElement = document.createElement("a");
  videoLinkElement.href = video.link;
  videoLinkElement.textContent = video.title;
  videoLinkElement.classList.add("video-link");
  videoLinkElement.target = "_blank";
  videoLinkElement.rel = "noopener noreferrer";

  videoItem.appendChild(videoLinkElement);
  return videoItem;
}

// Fonction générique pour afficher des vidéos
function displayVideos(containerSelector, startIndex, count) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = "";

  const allVideos = getAllVideosSorted();
  const videosToShow = allVideos.slice(startIndex, startIndex + count);

  videosToShow.forEach((video) => {
    const videoItem = createVideoItem(video);
    container.appendChild(videoItem);
  });
}

// Fonctions principales simplifiées
function displayLastFourVideos() {
  displayVideos(".video-container", 0, 4);
}

function displayOtherFourVideos() {
  displayVideos(".other-videos", 4, 4);
}

// Appel des fonctions
displayLastFourVideos();
displayOtherFourVideos();
