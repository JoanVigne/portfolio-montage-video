function displayLastFourVideos() {
  const videoContainer = document.querySelector(".video-container");
  videoContainer.innerHTML = ""; // Clear existing content

  // Flatten the videos object into an array
  const allVideos = [];
  for (const videoType in videos) {
    for (const videoId in videos[videoType]) {
      // Add the videoType to each video object
      const video = { ...videos[videoType][videoId], type: videoType };
      allVideos.push(video);
    }
  }

  // Sort the videos by date in descending order
  allVideos.sort((a, b) => new Date(b.date) - new Date(a.date));

  allVideos.forEach((video) => {
    const videoItem = document.createElement("div");
    videoItem.classList.add("video-item");

    const videoLink = video.link;
    const videoTitle = video.title;

    // Extract YouTube video ID from the link
    let extractedVideoId = null;
    if (videoLink.includes("youtube.com/watch")) {
      const videoIdMatch = videoLink.match(
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
      );
      extractedVideoId = videoIdMatch ? videoIdMatch[1] : null;
    } else if (videoLink.includes("youtube.com/shorts")) {
      const videoIdMatch = videoLink.match(
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?&]+)/
      );
      extractedVideoId = videoIdMatch ? videoIdMatch[1] : null;
    }

    if (extractedVideoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${extractedVideoId}/hqdefault.jpg`;

      const thumbnailImage = document.createElement("img");
      thumbnailImage.src = thumbnailUrl;
      thumbnailImage.alt = videoTitle;
      thumbnailImage.classList.add("video-thumbnail");

      const videoLinkElement = document.createElement("a");
      videoLinkElement.href = videoLink;
      videoLinkElement.textContent = videoTitle;
      videoLinkElement.classList.add("video-link");

      videoItem.appendChild(thumbnailImage);
      videoItem.appendChild(videoLinkElement);

      // Add click event to load the video in a modal
      thumbnailImage.addEventListener("click", function (event) {
        event.preventDefault();

        // Create modal overlay
        const modalOverlay = document.createElement("div");
        modalOverlay.classList.add("modal-overlay");
        modalOverlay.addEventListener("click", function () {
          document.body.removeChild(modalOverlay);
        });
        // Create modal content
        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");

        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${extractedVideoId}?autoplay=1`;
        iframe.width = "560";
        iframe.height = "315";
        iframe.frameBorder = "0";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        // Add class based on video type
        if (video.link.includes("short")) {
          iframe.classList.add("short");
        } else {
          iframe.classList.add("youtube");
        }
        // Create and add the "Close" button
        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.classList.add("close-button");

        // Add click event to the "Close" button to close the modal
        closeButton.addEventListener("click", function () {
          document.body.removeChild(modalOverlay);
        });

        modalContent.appendChild(iframe);
        modalContent.appendChild(closeButton);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        document.addEventListener("keydown", handleKeyDown);
        function handleKeyDown(event) {
          if (event.key === "Escape") {
            if (!modalOverlay) {
              console.log("no modal here");
            } else {
              document.body.removeChild(modalOverlay);
              document.removeEventListener("keydown", handleKeyDown);
            }
          }
        }
      });
    }

    videoContainer.appendChild(videoItem);
  });
}

// Call the new function to display the 4 most recent videos
displayLastFourVideos();
