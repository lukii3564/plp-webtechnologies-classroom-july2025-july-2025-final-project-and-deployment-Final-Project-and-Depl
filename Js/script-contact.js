/* ===========================
   CONTACT PAGE INTERACTIONS
   Instructor Luki Project
=========================== */

// Reusable function to select elements
const $ = (selector) => document.querySelector(selector);

// Contact form handler
function initContactForm() {
  const form = $("#contactForm");
  const statusBox = $("#formStatus");

  if (!form) return; // Exit if not on contact page

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent page reload

    // Collect values
    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const contact = $("#contact").value.trim();
    const message = $("#message").value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showStatus("⚠️ Please fill in all required fields.", "error", statusBox);
      return;
    }

    if (!validateEmail(email)) {
      showStatus("❌ Invalid email format.", "error", statusBox);
      return;
    }

    // Prepare payload
    const data = { name, email, contact, message };

    try {
      // Send to Formspree
      const response = await fetch("https://formspree.io/f/xgvvqbpz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showStatus("✅ Message sent successfully!", "success", statusBox);
        form.reset();
      } else {
        showStatus("❌ Something went wrong. Try again later.", "error", statusBox);
      }
    } catch (err) {
      console.error(err);
      showStatus("❌ Network error. Please check your connection.", "error", statusBox);
    }
  });
}

// Helper: validate email with regex
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.toLowerCase());
}

// Helper: show status messages
function showStatus(message, type, container) {
  container.textContent = message;
  container.className = type; // success / error
  container.style.display = "block";

  // Auto-hide after 5 seconds
  setTimeout(() => {
    container.style.display = "none";
  }, 5000);
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
});

/* ---------- Sidebar Toggle (for pages that don't load script.js) ---------- */
function initSidebarToggle() {
  const sidebar = document.getElementById("sidebar") || document.querySelector('.sidebar');
  const toggleBtn = document.getElementById("collapseBtn");

  if (!sidebar || !toggleBtn) return;

  // Restore previous state
  const saved = localStorage.getItem('sidebar-collapsed');
  if (saved === 'true') sidebar.classList.add('collapsed');

  // Ensure accessibility attribute exists
  toggleBtn.setAttribute('aria-expanded', !sidebar.classList.contains('collapsed'));

  toggleBtn.addEventListener('click', () => {
    const isCollapsed = sidebar.classList.toggle('collapsed');
    // Update aria-expanded to reflect visible state (true = expanded)
    toggleBtn.setAttribute('aria-expanded', !isCollapsed);
    // Persist preference
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSidebarToggle();
});
