const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const header = document.querySelector(".site-header");
const navItems = document.querySelectorAll(".nav-panel a");
const pathPills = document.querySelectorAll(".path-pill");
const pathNote = document.querySelector(".path-note");
const pathNotes = {
  web: "Viewing Web Developer — click again to reset.",
  frappe: "Viewing ERP Developer — click again to reset.",
  default: "Choose a path to reframe the page.",
};

const closeMenu = () => {
  navPanel?.classList.remove("is-open");
  menuToggle?.classList.remove("is-open");
  header?.classList.remove("is-open");
  document.body.classList.remove("is-locked");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open menu");
};

if (menuToggle && navPanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = !navPanel.classList.contains("is-open");
    navPanel.classList.toggle("is-open", isOpen);
    menuToggle.classList.toggle("is-open", isOpen);
    header?.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("is-locked", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
}

navItems.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.querySelectorAll(".project-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === "#") {
      event.preventDefault();
      alert(link.dataset.placeholder);
    }
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const applyPath = (path) => {
  const filtered = Boolean(path);
  document.body.classList.toggle("is-filtered", filtered);

  document.querySelectorAll("[data-path]:not(.path-pill)").forEach((item) => {
    item.classList.toggle("is-dimmed", filtered && item.dataset.path !== path);
  });

  pathPills.forEach((pill) => {
    const active = pill.dataset.path === path;
    pill.classList.toggle("is-active", active);
    pill.setAttribute("aria-selected", String(active));
  });

  if (pathNote) {
    pathNote.textContent = pathNotes[path] || pathNotes.default;
  }
};

pathPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const nextPath = pill.classList.contains("is-active") ? "" : pill.dataset.path;
    applyPath(nextPath);
  });
});

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sections = document.querySelectorAll("main section[id]");

const setActiveLink = () => {
  let current = "";

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });

  navItems.forEach((item) => {
    if (item.classList.contains("nav-cta")) {
      return;
    }

    const href = item.getAttribute("href");
    item.classList.toggle("is-active", href === `#${current}`);
  });

  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 800) {
    closeMenu();
  }
});
setActiveLink();
