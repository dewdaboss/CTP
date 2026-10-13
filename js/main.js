(() => {
  const config = window.SITE_CONFIG || {};
  const brandName = config.brandName || "Creative Team Production";
  const shortName = config.shortName || "CTP";
  const fallbackInstagram = "https://www.instagram.com/creative_team_production_/";
  const instagramUrl = /^https:\/\/(www\.)?instagram\.com\//i.test(config.instagramUrl || "")
    ? config.instagramUrl
    : fallbackInstagram;
  const whatsappDigits = String(config.whatsappNumber || "").replace(/\D/g, "");
  const whatsappReady = whatsappDigits.length >= 8 && whatsappDigits.length <= 15;

  document.querySelectorAll("[data-brand-name]").forEach((element) => {
    element.textContent = brandName.toUpperCase();
  });
  document.querySelectorAll("[data-brand-short]").forEach((element) => {
    element.textContent = shortName;
  });
  document.querySelectorAll("[data-instagram-link]").forEach((link) => {
    link.href = instagramUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
  document.title = `${brandName} — Reels & Brand Films`;

  const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
  const quickMessage = `Hi ${brandName}, I would like to talk about a video project.`;
  const quickUrl = whatsappReady
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(quickMessage)}`
    : "#booking-form";

  whatsappLinks.forEach((link) => {
    link.href = quickUrl;
    if (whatsappReady) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-label");
    }
  });

  const status = document.querySelector("[data-whatsapp-status]");
  const bookingForm = document.querySelector("#booking-form");

  function showStatus(message, includeInstagram = false) {
    if (!status) return;
    status.replaceChildren(document.createTextNode(message));
    if (includeInstagram) {
      status.append(document.createTextNode(" "));
      const link = document.createElement("a");
      link.href = instagramUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Send an Instagram DM instead.";
      status.append(link);
    }
    status.hidden = false;
  }

  whatsappLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (whatsappReady) return;
      event.preventDefault();
      showStatus(
        "WhatsApp is ready to connect once the creator’s number is added. For now, reach out on Instagram.",
        true
      );
      if (bookingForm) {
        bookingForm.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  if (bookingForm) {
    const dateField = bookingForm.querySelector('input[name="date"]');
    if (dateField) {
      const now = new Date();
      const localToday = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
      dateField.min = localToday;
    }

    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!bookingForm.reportValidity()) return;

      if (!whatsappReady) {
        showStatus(
          "This booking form is ready, but the creator’s WhatsApp number has not been connected yet. Please message on Instagram for now.",
          true
        );
        return;
      }

      const formData = new FormData(bookingForm);
      const values = {
        name: String(formData.get("name") || "").trim(),
        brand: String(formData.get("brand") || "").trim(),
        service: String(formData.get("service") || "").trim(),
        date: String(formData.get("date") || "").trim(),
        clientContact: String(formData.get("clientContact") || "").trim(),
        brief: String(formData.get("brief") || "").trim()
      };
      const lines = [
        `Hi ${brandName}, I’d like to enquire about a project.`,
        "",
        `Name: ${values.name}`,
        values.brand ? `Brand: ${values.brand}` : null,
        `Looking for: ${values.service}`,
        values.date ? `Ideal shoot date: ${values.date}` : null,
        `My WhatsApp / phone: ${values.clientContact}`,
        "",
        `Project brief: ${values.brief}`
      ].filter(Boolean);
      const url = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(lines.join("\n"))}`;
      const popup = window.open(url, "_blank", "noopener,noreferrer");
      if (popup) popup.opener = null;
      showStatus("Your booking details are ready in WhatsApp. Review the message and tap Send to reach the creator.");
    });
  }

  const menuToggle = document.querySelector("#menu-toggle");
  const navPanel = document.querySelector("#primary-navigation");
  if (menuToggle && navPanel) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navPanel.classList.remove("is-open");
    };
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navPanel.classList.toggle("is-open", !isOpen);
    });
    navPanel.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const filters = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      cards.forEach((card) => {
        card.classList.toggle("is-filtered", filter !== "all" && card.dataset.category !== filter);
      });
    });
  });

  const progress = document.querySelector("#scroll-progress");
  const updateProgress = () => {
    if (!progress) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    document.querySelectorAll("[data-reveal]").forEach((element) => {
      element.classList.add("reveal");
      observer.observe(element);
    });
  }

  const heroVisual = document.querySelector("[data-tilt]");
  if (heroVisual && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    heroVisual.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.setProperty("--tilt-x", `${x * 3}deg`);
      heroVisual.style.setProperty("--tilt-y", `${y * -3}deg`);
    });
    heroVisual.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--tilt-x", "0deg");
      heroVisual.style.setProperty("--tilt-y", "0deg");
    });
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
