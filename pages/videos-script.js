function displayVideos() {
  const youtubeContainer = document.querySelector(".youtube-videos");
  const shortsContainer = document.querySelector(".shorts-videos");

  youtubeContainer.innerHTML = ""; // Clear existing content
  shortsContainer.innerHTML = ""; // Clear existing content

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

  // Display the videos in their respective containers
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

      // Add click event to load the video
      thumbnailImage.addEventListener("click", function (event) {
        event.preventDefault();
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${extractedVideoId}?autoplay=1`;
        iframe.width = "560";
        iframe.height = "315";
        iframe.frameBorder = "0";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        videoItem.innerHTML = "";
        videoItem.appendChild(iframe);
      });
    }

    // Append the video item to the respective container
    if (video.type === "youtube") {
      youtubeContainer.appendChild(videoItem);
    } else if (video.type === "shorts") {
      shortsContainer.appendChild(videoItem);
    }
  });
}

// Call the function to display the videos
displayVideos();
