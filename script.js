console.log('Its working')

let theme = localStorage.getItem('theme')

if(theme == null){
	setTheme('light')
}else{
	setTheme(theme)
}

let themeDots = document.getElementsByClassName('theme-dot')

for (var i=0; themeDots.length > i; i++){
	themeDots[i].addEventListener('click', function(){
		let mode = this.dataset.mode
		console.log('Option clicked:', mode)
		setTheme(mode)
	})
}

function setTheme(mode){
	if(mode == 'light'){
		document.getElementById('theme-style').href = 'default.css'
		// Show light LinkedIn cover, hide dark
		let lightImg = document.getElementById('social_img_light');
		let darkImg = document.getElementById('social_img_dark');
		if (lightImg && darkImg) {
			lightImg.style.display = 'block';
			darkImg.style.display = 'none';
		}
	}

	if(mode == 'blue'){
		document.getElementById('theme-style').href = 'blue.css'
		// Show dark LinkedIn cover, hide light
		let lightImg = document.getElementById('social_img_light');
		let darkImg = document.getElementById('social_img_dark');
		if (lightImg && darkImg) {
			lightImg.style.display = 'none';
			darkImg.style.display = 'block';
		}
	}
	localStorage.setItem('theme', mode)
}

const carouselTrack = document.querySelector('.carousel-track');
const posts = Array.from(document.querySelectorAll('.carousel-card'));
const nextButton = document.querySelector('.next-btn');
const prevButton = document.querySelector('.prev-btn');
let currentIndex = 0;
let isCarouselMoving = true; // Flag to track carousel state

function moveCarousel(index) {
	if (index !== undefined) {
		currentIndex = index;
	} else {
		currentIndex = (currentIndex + 1) % posts.length;
	}

	const cardWidth = posts[0].getBoundingClientRect().width;
	const cardMarginRight = parseFloat(getComputedStyle(posts[0]).marginRight);
	const totalCardWidth = cardWidth + cardMarginRight;
	const offset = -currentIndex * totalCardWidth;

	carouselTrack.style.transform = `translateX(${offset}px)`;
}

// Start the carousel movement (conditionally)
let carouselInterval = setInterval(() => {
	if (isCarouselMoving) {
		moveCarousel();
	}
}, 3000);

// Handle hover events
carouselTrack.addEventListener('mouseover', () => {
	isCarouselMoving = false; // Stop autoplay on hover
});

carouselTrack.addEventListener('mouseout', () => {
	isCarouselMoving = true; // Resume autoplay on mouseout (if carousel is still moving)
});

// Handle click events for mobile-friendly scrolling (optional)
if (window.innerWidth < 768) { // Adjust breakpoint as needed
	carouselTrack.addEventListener('touchstart', () => {
		isCarouselMoving = false; // Stop autoplay on touch
	});

	carouselTrack.addEventListener('touchend', () => {
		// Optional: Implement mobile-specific scrolling logic here
		// You could use a library like Swiper.js or Hammer.js for touch gestures
	});
}

// Handle next/previous button clicks (optional)
if (nextButton) {
	nextButton.addEventListener('click', () => {
		moveCarousel(currentIndex + 1); // Move to the next card
	});
}

if (prevButton) {
	prevButton.addEventListener('click', () => {
		moveCarousel((currentIndex - 1 + posts.length) % posts.length); // Wrap around at the beginning
	});
}

// Truncate project descriptions 
document.addEventListener("DOMContentLoaded", function() {
    const descriptions = document.querySelectorAll('.card-description');

    descriptions.forEach(desc => {
      const words = desc.textContent.trim().split(/\s+/);
      if (words.length > 10) {
        const truncated = words.slice(0, 10).join(' ') + '...';
        desc.textContent = truncated;
      }
    });
});
