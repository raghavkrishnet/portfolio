const lightbox = document.querySelector(".image-gallery-container .lightbox");
const lightboxImage = document.querySelector(
  ".image-gallery-container .lightbox img"
);
/*
const lightboxTitle = document.querySelector(
  ".image-gallery-container .lightbox .title"
);
*/
const downloadBtn = document.querySelector(
  ".download-btn"
);
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = lightboxImage.src;
  link.download = lightboxImage.src.split("/").pop(); 
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

const nextBtn = document.querySelector(".image-gallery-container .next-btn");
const previousBtn = document.querySelector(
  ".image-gallery-container .prev-btn"
);
const closeBtn = document.querySelector(".image-gallery-container .close-btn");

const showImage = (data) => {
  currentImage = data;
  lightbox.classList.add("active");
  let image = data.querySelector("img");

  lightboxImage.src = image.src;
  downloadBtn.href = image.src;

  // Function to show and hide the header
  const showHeader = () => {
    lightboxHeader.classList.add("visible");
    clearTimeout(lightboxHeader.hideTimeout);
    lightboxHeader.hideTimeout = setTimeout(() => {
      lightboxHeader.classList.remove("visible");
    }, 2000);
  };

  showHeader();

  lightbox.addEventListener("mousemove", showHeader);
};


closeBtn.addEventListener("click", () => {
  lightbox.classList.remove("active");
});

nextBtn.addEventListener("click", () => {
  if (currentImage.nextElementSibling) {
    currentImage = currentImage.nextElementSibling;
    showImage(currentImage);
  }
});

previousBtn.addEventListener("click", () => {
  if (currentImage.previousElementSibling) {
    currentImage = currentImage.previousElementSibling;
    showImage(currentImage);
  }
});

const zoomBtn = document.querySelector(".image-gallery-container .zoom-btn");
let zoomLevel = 1;
const openNewTabBtn = document.querySelector(".image-gallery-container .open-new-tab-btn");
const fullscreenBtn = document.querySelector(".image-gallery-container .fullscreen-btn");

// Zoom functionality
zoomBtn.addEventListener("click", () => {
  // Increment zoom level, loop back to 1x if over 5x
  zoomLevel = zoomLevel < 5 ? zoomLevel + 1 : 1;

  // Apply the zoom level to the image
  lightboxImage.style.transform = `scale(${zoomLevel})`;

  // Update the button's title based on the current zoom level
  zoomBtn.title = `Zoom ${zoomLevel}x`;

  // Update the icon depending on the zoom level
  const icon = zoomBtn.querySelector("i");
  icon.classList.remove("fa-search-plus", "fa-search-minus");
  if (zoomLevel === 1) {
    icon.classList.add("fa-search-plus");
  } else {
    icon.classList.add("fa-search-minus");
  }

  console.log("Zoom level:", `${zoomLevel}x`);
});

// Fullscreen functionality
fullscreenBtn.addEventListener("click", () => {
  if (isFullscreen()) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
});

function isFullscreen() {
  return document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;
}

function enterFullscreen() {
  const element = lightbox;
  element.requestFullscreen = element.requestFullscreen ||
    element.mozRequestFullScreen ||
    element.webkitRequestFullscreen ||
    element.msRequestFullscreen;
  element.requestFullscreen();
}

function exitFullscreen() {
  document.exitFullscreen = document.exitFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen;
  document.exitFullscreen();
}




const lightboxHeader = lightbox.querySelector(".lightbox-header");
let headerTimeout;

// function to show header
const showHeader = () => {
  lightboxHeader.classList.add("visible");

  clearTimeout(headerTimeout);

  headerTimeout = setTimeout(() => {
    lightboxHeader.classList.remove("visible");
  }, 2000);


}
