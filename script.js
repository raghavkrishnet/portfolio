console.log("It's working");

// ================== THEME MANAGEMENT ==================
let theme = localStorage.getItem("theme");

if (!theme) {
  setTheme("light");
} else {
  setTheme(theme);
}

const themeDots = document.getElementsByClassName("theme-dot");
for (let i = 0; i < themeDots.length; i++) {
  themeDots[i].addEventListener("click", function () {
    let mode = this.dataset.mode;
    console.log("Option clicked:", mode);
    setTheme(mode);
  });
}

function setTheme(mode) {
  const themeLink = document.getElementById("theme-style");
  const lightImg = document.getElementById("social_img_light");
  const darkImg = document.getElementById("social_img_dark");

  switch (mode) {
    case "light":
      themeLink.href = "default.css";
      if (lightImg && darkImg) {
        lightImg.style.display = "block";
        darkImg.style.display = "none";
      }
      break;
    case "blue":
      themeLink.href = "blue.css";
      if (lightImg && darkImg) {
        lightImg.style.display = "none";
        darkImg.style.display = "block";
      }
      break;
  }

  localStorage.setItem("theme", mode);
}

// ================== CAROUSEL FUNCTIONALITY ==================
const carouselTrack = document.querySelector(".carousel-track");
const posts = Array.from(document.querySelectorAll(".carousel-card"));
const nextButton = document.querySelector(".next-btn");
const prevButton = document.querySelector(".prev-btn");

let currentIndex = 0;
let isCarouselMoving = true;

function moveCarousel(index = (currentIndex + 1) % posts.length) {
  currentIndex = index;

  const card = posts[0];
  const cardWidth = card.getBoundingClientRect().width;
  const cardMarginRight = parseFloat(getComputedStyle(card).marginRight);
  const offset = -currentIndex * (cardWidth + cardMarginRight);

  carouselTrack.style.transform = `translateX(${offset}px)`;
}

// Auto-scroll every 3 seconds
let carouselInterval = setInterval(() => {
  if (isCarouselMoving) moveCarousel();
}, 3000);

// Pause on hover
carouselTrack.addEventListener("mouseover", () => {
  isCarouselMoving = false;
});

carouselTrack.addEventListener("mouseout", () => {
  isCarouselMoving = true;
});

// Mobile touch pause
if (window.innerWidth < 768) {
  carouselTrack.addEventListener("touchstart", () => {
    isCarouselMoving = false;
  });
  carouselTrack.addEventListener("touchend", () => {
    // Optional: Mobile-specific scrolling logic
  });
}

// Navigation buttons
if (nextButton) {
  nextButton.addEventListener("click", () => {
    moveCarousel(currentIndex + 1);
  });
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    moveCarousel((currentIndex - 1 + posts.length) % posts.length);
  });
}

// ================== TRUNCATE DESCRIPTIONS ==================
document.addEventListener("DOMContentLoaded", () => {
  const descriptions = document.querySelectorAll(".card-description");

  descriptions.forEach((desc) => {
    const words = desc.textContent.trim().split(/\s+/);
    if (words.length > 10) {
      desc.textContent = words.slice(0, 10).join(" ") + "...";
    }
  });
});

// ================== FORM HANDLING ==================
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  // Get the form action URL
  const form = e.target;
  const action = form.getAttribute("action");
  // Submit the form using Fetch API
  fetch(action, {
    method: "POST",
    body: new FormData(form),
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Show success message
		alert("Form Submitted Succesfully")
        document.getElementById("successMessage").style.display = "block";
        // Reset form
        form.reset();
        // Hide success message after 5 seconds
        setTimeout(() => {
          document.getElementById("successMessage").style.display = "none";
        }, 5000);
      } else {
        throw new Error("Form submission failed");
      }
    })
    .catch((error) => {
      alert(
        "There was a problem sending your message. Please try again later."
      );
      console.error("Error:", error);
    });
});
