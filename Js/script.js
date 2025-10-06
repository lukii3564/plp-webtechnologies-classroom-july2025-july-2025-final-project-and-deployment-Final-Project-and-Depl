/* =========================
   Instructor Luki Dashboard
   script.js
   ========================= */

/* ---------- Utility Functions ---------- */

/**
 * Add a class to an element
 * @param {Element} el 
 * @param {string} className 
 */
function addClass(el, className) {
  if (el && !el.classList.contains(className)) {
    el.classList.add(className);
  }
}

/**
 * Remove a class from an element
 * @param {Element} el 
 * @param {string} className 
 */
function removeClass(el, className) {
  if (el && el.classList.contains(className)) {
    el.classList.remove(className);
  }
}

/**
 * Toggle a class on an element
 * @param {Element} el 
 * @param {string} className 
 */
function toggleClass(el, className) {
  if (el) {
    el.classList.toggle(className);
  }
}

/* ---------- Sidebar Toggle ---------- */
function initSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.getElementById("collapseBtn");

  if (sidebar && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      toggleClass(sidebar, "collapsed");
    });
  }
}

/* ---------- Active Link Highlight ---------- */
function setActiveLink() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (currentPath === linkPath) {
      addClass(link, "active");
    } else {
      removeClass(link, "active");
    }
  });
}

/* ---------- Button Animation ---------- */
function initButtonAnimations() {
  const buttons = document.querySelectorAll("button, .btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      addClass(btn, "btn-bounce");
      setTimeout(() => removeClass(btn, "btn-bounce"), 300); // reset animation
    });
  });
}

/* ---------- Init All ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  setActiveLink();
  initButtonAnimations();
  initEnrollPopup();
  initCounters();
});

/* ---------- Animated Counters (Dashboard tiles) ---------- */
function initCounters() {
  const tiles = document.querySelectorAll('.tile');
  if (!tiles || tiles.length === 0) return;

  const duration = 1200; // ms for each count

  function animateValue(el) {
    const valueEl = el.querySelector('.tile-value');
    if (!valueEl) return;
    if (valueEl.dataset.animated === '1') return; // already animated

    const target = parseInt(valueEl.textContent.replace(/[^0-9]/g, ''), 10) || 0;
    const start = 0;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * (target - start) + start);
      valueEl.textContent = current.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        valueEl.textContent = target.toLocaleString();
        valueEl.dataset.animated = '1';
      }
    }

    valueEl.textContent = '0';
    window.requestAnimationFrame(step);
  }

  // Use IntersectionObserver to trigger when tiles enter the viewport
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  tiles.forEach((t) => observer.observe(t));
}

/* ---------- Enrollment Popup ---------- */
function initEnrollPopup() {
  const overlay = document.getElementById('enrollOverlay');
  if (!overlay) return; // nothing to do on pages without popup

  const popupClose = overlay.querySelector('.enroll-close');

  function showPopup() {
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    // auto-hide after 3 seconds
    setTimeout(hidePopup, 3000);
  }

  function hidePopup() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  }

  // delegate clicks from enroll buttons
  document.addEventListener('click', (e) => {
    // Match common patterns: explicit .btn.enroll / button.enroll, or any <button> inside .course-card
    const btn = e.target.closest('.btn.enroll, button.enroll, .course-card button, .course-body button');
    if (btn) {
      e.preventDefault();
      showPopup();
    }
  });

  // close handlers
  if (popupClose) popupClose.addEventListener('click', hidePopup);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hidePopup();
  });
}
