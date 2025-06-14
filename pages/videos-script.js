// Affiche toutes les vidéos triées par date dans les bons conteneurs
function displayAllVideos() {
  const allVideos = getAllVideosSorted();

  const youtubeContainer = document.querySelector(".youtube-videos");
  const shortsContainer = document.querySelector(".shorts-videos");
  const instagramContainer = document.querySelector(".instagram-videos");

  youtubeContainer.innerHTML = "";
  shortsContainer.innerHTML = "";
  instagramContainer.innerHTML = "";

  allVideos.forEach((video) => {
    const videoInfo = extractVideoInfo(video.link);
    if (!videoInfo) return;

    const item = createVideoItem(video);

    switch (videoInfo.platform) {
      case "youtube":
        youtubeContainer.appendChild(item);
        break;
      case "youtube-short":
        shortsContainer.appendChild(item);
        break;
      case "instagram":
        instagramContainer.appendChild(item);
        break;
    }
  });
}

// Appel de la fonction principale
displayAllVideos();
