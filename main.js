// SAFE DROP-IN: works with your current HTML/markup as-is
(function () {
  // ------ Lightbox elements (same selectors you already use) ------
  const lightbox = document.querySelector(".image-gallery-container .lightbox");
  const lightboxImage = document.querySelector(".image-gallery-container .lightbox img");

  const downloadBtn = document.querySelector(".download-btn");
  const nextBtn = document.querySelector(".image-gallery-container .next-btn");
  const previousBtn = document.querySelector(".image-gallery-container .prev-btn");
  const closeBtn = document.querySelector(".image-gallery-container .close-btn");
  const zoomBtn = document.querySelector(".image-gallery-container .zoom-btn");
  const openNewTabBtn = document.querySelector(".image-gallery-container .open-new-tab-btn");
  const fullscreenBtn = document.querySelector(".image-gallery-container .fullscreen-btn");

  const lightboxHeader = lightbox?.querySelector(".lightbox-header");
  const counterEl = document.querySelector(".image-counter");

  // ------ Gallery + template ------
  const DATA_URL = 'data/projects.json';
  const gallery = document.querySelector('#project-gallery');
  const tpl = document.querySelector('#project-card-tpl');

  // State
  let currentImage = null;
  let zoomLevel = 1;

  let lastFocusedEl = null;

  // Utility: update 1/N counter
  function updateCounter() {
    if (!counterEl || !gallery) return;
    const nodes = Array.from(gallery.children);
    const index = currentImage ? nodes.indexOf(currentImage) + 1 : 1;
    const reverseIndex = nodes.length - index + 1;

    counterEl.textContent = `${reverseIndex}/${nodes.length}`;
  }

  // Utility: focus trap inside lightbox
  const focusSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let focusables = [];
  function trapFocus(e) {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key !== 'Tab') return;
    focusables = Array.from(lightbox.querySelectorAll(focusSelectors)).filter(el => !el.disabled && el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // Download current image
  downloadBtn?.addEventListener("click", () => {
    if (!lightboxImage?.src) return;
    const link = document.createElement("a");
    link.href = lightboxImage.src;
    link.download = lightboxImage.src.split("/").pop() || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Show image 
  const showImage = (data) => {
    if (!lightbox || !lightboxImage) return;

    currentImage = data;
    lightbox.classList.add("active");
    lightbox.setAttribute('aria-hidden', 'false');

    // Swap src + alt/title from card image
    const image = data.querySelector("img");
    if (image) {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt || image.title || "Project image";
      lightboxImage.title = image.title || "";
    }

    // header show/hide behavior
    const showHeader = () => {
      lightboxHeader.classList.add("visible");
      clearTimeout(lightboxHeader.hideTimeout);
      lightboxHeader.hideTimeout = setTimeout(() => {
        lightboxHeader.classList.remove("visible");
      }, 2000);
    };
    showHeader();
    lightbox.addEventListener("mousemove", showHeader);

    // reset zoom
    zoomLevel = 1;
    lightboxImage.style.transform = 'scale(1)';
    if (zoomBtn) {
      zoomBtn.title = "Zoom";
      zoomBtn.setAttribute('aria-label', 'Zoom in');
      const icon = zoomBtn.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-search-minus");
        icon.classList.add("fa-search-plus");
      }
    }

    // focus management (trap inside modal)
    lastFocusedEl = document.activeElement;
    setTimeout(() => {
      const firstFocusable = lightbox.querySelector(focusSelectors);
      firstFocusable?.focus();
    }, 0);

    updateCounter();
  };

  // Expose for click handlers from the renderer
  window.showImage = showImage;

  // Close / Next / Prev
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute('aria-hidden', 'true');
    zoomLevel = 1;
    if (lightboxImage) lightboxImage.style.transform = 'scale(1)';
    lastFocusedEl?.focus();
  }
  closeBtn?.addEventListener("click", closeLightbox);

  nextBtn?.addEventListener("click", () => {
    if (currentImage?.nextElementSibling) showImage(currentImage.nextElementSibling);
  });

  previousBtn?.addEventListener("click", () => {
    if (currentImage?.previousElementSibling) showImage(currentImage.previousElementSibling);
  });

  // Keyboard controls while lightbox is open
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextBtn?.click();
    if (e.key === 'ArrowLeft') previousBtn?.click();
    trapFocus(e);
  });

  // Zoom
  zoomBtn?.addEventListener("click", () => {
    if (!lightboxImage) return;
    zoomLevel = zoomLevel < 5 ? zoomLevel + 1 : 1;
    lightboxImage.style.transform = `scale(${zoomLevel})`;
    zoomBtn.title = zoomLevel === 1 ? "Zoom" : `Zoom ${zoomLevel}x`;
    zoomBtn.setAttribute('aria-label', zoomLevel === 1 ? 'Zoom in' : 'Zoom out');

    const icon = zoomBtn.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-search-plus", "fa-search-minus");
      icon.classList.add(zoomLevel === 1 ? "fa-search-plus" : "fa-search-minus");
    }
  });

  // Open in new tab
  openNewTabBtn?.addEventListener("click", () => {
    if (lightboxImage?.src) window.open(lightboxImage.src, "_blank", "noopener");
  });

  // Fullscreen
  function isFullscreen() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  }
  function enterFullscreen() {
    lightbox?.requestFullscreen?.() || lightbox?.webkitRequestFullscreen?.() || lightbox?.msRequestFullscreen?.();
  }
  function exitFullscreen() {
    document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
  }
  fullscreenBtn?.addEventListener("click", () => {
    if (isFullscreen()) exitFullscreen(); else enterFullscreen();
  });

  // -------- JSON render  --------
  if (!gallery || !tpl) return;

  fetch(DATA_URL, { cache: 'no-store' })
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load ${DATA_URL}`);
      return r.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('projects.json must be an array');

      // display newest first
      const items = [...data].sort((a, b) => (b.id || 0) - (a.id || 0));
      const frag = document.createDocumentFragment();

      items.forEach(item => {
        const node = tpl.content.firstElementChild.cloneNode(true);
        const img = node.querySelector('img');
        const title = node.querySelector('.title');

        // basic image fields
        img.src = item.img;
        img.alt = item.alt || item.title || 'Project image';
        img.title = item.title || '';
        img.loading = 'lazy';
        img.decoding = 'async';

        title.textContent = item.title || '';

        // open lightbox (click/keyboard)
        node.addEventListener('click', () => window.showImage?.(node));
        node.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.showImage?.(node);
          }
        });

        // broken image fallback
        img.addEventListener('error', () => {
          img.alt = "Image failed to load";
          // optional: img.src = "images/fallback.jpg";
        });

        frag.appendChild(node);
      });

      gallery.replaceChildren(frag);
      totalImages = gallery.children.length;
      updateCounter();
    })
    .catch(err => {
      console.error(err);
      gallery.innerHTML = '<p style="opacity:.7">Could not load projects right now.</p>';
    });
})();
