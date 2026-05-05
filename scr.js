(() => {
  const phoneIntl = "256775865395";
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

    // Gallery filtering
    const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
    const galleryItems = Array.from(document.querySelectorAll("[data-category]"));

  const setActiveFilterBtn = (activeBtn) => {
    filterButtons.forEach((btn) => {
      btn.classList.remove("bg-slate-900", "text-white", "border-slate-900");
      btn.classList.add("bg-white", "text-slate-900", "border-slate-200");
      btn.setAttribute("aria-pressed", btn === activeBtn ? "true" : "false");
    });
    activeBtn.classList.remove("bg-white", "text-slate-900", "border-slate-200");
    activeBtn.classList.add("bg-slate-900", "text-white", "border-slate-900");
  };

  const applyFilter = (filter) => {
    galleryItems.forEach((item) => {
      const cats = (item.getAttribute("data-category") || "")
        .split(" ")
        .map((s) => s.trim())
        .filter(Boolean);
      const show = filter === "all" || cats.includes(filter);
      item.classList.toggle("hidden", !show);
    });
  };

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter") || "all";
        setActiveFilterBtn(btn);
        applyFilter(filter);
      });
    });

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
