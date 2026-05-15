(() => {
  const phoneIntl = "256702218782";
  const callPhoneDisplay = "+256 775 865395";

  const encode = (text) => encodeURIComponent(text.trim());
  const waLink = (text) => `https://wa.me/${phoneIntl}?text=${encode(text)}`;

  let initialized = false;

  const init = () => {
    if (initialized) return;
    initialized = true;

    // Mobile nav toggle
    const navToggle = document.getElementById("nav-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    const mobileNavBackdrop = document.getElementById("mobile-nav-backdrop");

  const closeMobileNav = () => {
    if (!mobileNav) return;
    mobileNav.classList.add("hidden");
    mobileNavBackdrop?.classList.add("hidden");
    navToggle?.setAttribute("aria-expanded", "false");
  };

  const openMobileNav = () => {
    if (!mobileNav) return;
    mobileNav.classList.remove("hidden");
    mobileNavBackdrop?.classList.remove("hidden");
    navToggle?.setAttribute("aria-expanded", "true");
  };

    navToggle?.addEventListener("click", () => {
      const isHidden = mobileNav?.classList.contains("hidden");
      if (isHidden) openMobileNav();
      else closeMobileNav();
    });

    mobileNavBackdrop?.addEventListener("click", closeMobileNav);
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", () => {
        // Close mobile menu after navigation
        closeMobileNav();
      });
    });

    // Populate common WhatsApp links
    document.querySelectorAll("[data-wa]").forEach((el) => {
      const message = el.getAttribute("data-wa") || "";
      el.setAttribute("href", waLink(message));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    // Gallery carousel
    const galleryTrack = document.getElementById("gallery-track");
    const galleryPrev = document.getElementById("gallery-prev");
    const galleryNext = document.getElementById("gallery-next");
    const galleryMore = document.getElementById("gallery-more");

    if (galleryTrack) {
      const updateGalleryControls = () => {
        const maxScrollLeft = Math.max(0, galleryTrack.scrollWidth - galleryTrack.clientWidth);
        const atStart = galleryTrack.scrollLeft <= 4;
        const atEnd = maxScrollLeft - galleryTrack.scrollLeft <= 4;

        if (galleryPrev) galleryPrev.disabled = atStart;
        if (galleryNext) galleryNext.disabled = atEnd;
      };

      const getGalleryStep = () => {
        const firstCard = galleryTrack.querySelector("[data-gallery-card]:not(.hidden)");
        if (!firstCard) return 0;
        const trackStyles = window.getComputedStyle(galleryTrack);
        const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || "0");
        return firstCard.getBoundingClientRect().width + gap;
      };

      const scrollGalleryByStep = (direction) => {
        const step = getGalleryStep();
        if (!step) return;
        galleryTrack.scrollBy({ left: direction * step, behavior: "smooth" });
      };

      galleryPrev?.addEventListener("click", () => scrollGalleryByStep(-1));
      galleryNext?.addEventListener("click", () => scrollGalleryByStep(1));

      // Load more logic
      galleryMore?.addEventListener("click", () => {
        const hiddenCards = Array.from(galleryTrack.querySelectorAll("[data-gallery-card].hidden"));
        const batchSize = 4;
        const toShow = hiddenCards.slice(0, batchSize);
        
        // Grab the first card we're about to show so we can scroll to it
        const firstNewCard = toShow[0];
        
        toShow.forEach(card => card.classList.remove("hidden"));
        
        if (hiddenCards.length <= batchSize) {
          galleryMore.classList.add("hidden");
        }
        
        updateGalleryControls();

        // Smoothly scroll to the new content
        if (firstNewCard) {
          galleryTrack.scrollTo({
            left: firstNewCard.offsetLeft - 16, // -16 for a little bit of padding
            behavior: "smooth"
          });
        }
      });

      galleryTrack.addEventListener("scroll", updateGalleryControls, { passive: true });
      window.addEventListener("resize", updateGalleryControls);
      
      // Initial check
      setTimeout(updateGalleryControls, 100);
    }

    // Energy-saving stove size selector
    const stoveSizeButtons = Array.from(document.querySelectorAll("[data-stove-size]"));
    const stoveCta = document.getElementById("stove-wa-cta");
    const stoveHiddenInput = document.getElementById("stove-size-selected");

  const setActiveStoveSize = (active) => {
    stoveSizeButtons.forEach((btn) => {
      const isActive = btn === active;
      btn.classList.toggle("bg-emerald-600", isActive);
      btn.classList.toggle("text-white", isActive);
      btn.classList.toggle("border-emerald-600", isActive);
      btn.classList.toggle("bg-white", !isActive);
      btn.classList.toggle("text-slate-900", !isActive);
      btn.classList.toggle("border-slate-200", !isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const updateStoveCta = (size) => {
    const message = `Hi MESCL, I want an Energy Saving Stove (${size}). Please share the price and delivery options to Buyembe/Mayuge.`;
    stoveCta?.setAttribute("href", waLink(message));
    stoveCta?.setAttribute("target", "_blank");
    stoveCta?.setAttribute("rel", "noopener noreferrer");
    if (stoveHiddenInput) stoveHiddenInput.textContent = size;
  };

    if (stoveSizeButtons.length && stoveCta) {
      const defaultBtn = stoveSizeButtons.find((b) => b.getAttribute("data-stove-size") === "Medium") || stoveSizeButtons[0];
      setActiveStoveSize(defaultBtn);
      updateStoveCta(defaultBtn.getAttribute("data-stove-size") || "Medium");

      stoveSizeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const size = btn.getAttribute("data-stove-size") || "Medium";
          setActiveStoveSize(btn);
          updateStoveCta(size);
        });
      });
    }

    // Keep call display in sync if used
    document.querySelectorAll("[data-call-display]").forEach((el) => {
      el.textContent = callPhoneDisplay;
    });

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  };

  // If the page uses HTML partial includes, wait for them to load.
  document.addEventListener("mescl:includes-loaded", init, { once: true });
  // Otherwise initialize on DOMContentLoaded.
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      if (document.querySelector("[data-include]")) return;
      init();
    },
    { once: true }
  );
})();
