Instructor Luki — Web Dev Final Project
=====================================

Overview
--------
This is a small static website project for an instructor dashboard and courses listing built with plain HTML, CSS, and vanilla JavaScript. It demonstrates responsive layouts, accessible sidebar navigation, interactive UI patterns (enrollment popup, animated counters), and a simple courses catalogue.

Repository structure
--------------------
- index.html       — Dashboard home (overview tiles, counters, featured courses)
- courses.html     — Courses listing (grid of course cards, enroll buttons, roadmaps)
- contact.html     — Contact form and blog area
- styles.css       — Global styling, layout, responsive breakpoints, and components
- courses.css      — Courses-page specific styles and layout adjustments
- script.js        — Sidebar toggle, active link handling, enrollment popup, animated counters
- images-final-project/ — Images used on pages (icons, logos)
- README.md        — This file

Key features
------------
- Responsive sidebar that collapses to an icon-only bar on mobile.
- Unified sidebar markup across pages for consistent behavior.
- Courses page uses a 3-column grid on laptop widths (configurable breakpoints) to avoid awkward empty space.
- Enrollment popup (white dialog) triggered when users click ENROLL buttons.
- Animated dashboard counters for Courses, Students, and Announcements that trigger when scrolled into view.
- Floating WhatsApp action button and LinkedIn link in sidebar footer.

How to view locally
-------------------
1. Clone or copy the project folder to your local machine.
2. Open `index.html` (or any page) in your browser. Because this is a static site, no build tools or local server are strictly required.

Optional: Serve with a local HTTP server (recommended for consistent behavior):
- Using Python 3:
  python -m http.server 8000
  Then open http://localhost:8000/index.html in your browser.

- Using Node.js (http-server):
  npx http-server -p 8000
  Then open http://localhost:8000/index.html

Files of interest
-----------------
- `styles.css` — global variables, sidebar styles, responsive breakpoints, enrollment popup styles, WhatsApp FAB styles.
- `courses.css` — page-specific layout; the grid behavior for courses is controlled here (3 columns on 992–1600px by default).
- `script.js` — initialization functions: `initSidebar()`, `initEnrollPopup()`, `initCounters()` (these are called on DOMContentLoaded). `initCounters()` uses IntersectionObserver to animate counters when tiles scroll into view.

Customizing counters
--------------------
- Edit the numbers inside the `.tile .tile-value` elements in `index.html` to change the animated target values.
- To fetch dynamic counts from an API, modify `script.js` to fetch values and pass them to the counter animation.

Testing checklist
-----------------
- Open `index.html` and reload. Scroll down to the overview tiles to verify the counters animate once.
- Open `courses.html` at laptop widths (approx. 992–1600px) and verify each course section shows up to three columns.
- Click an ENROLL button anywhere and confirm the enrollment popup appears and auto-closes.
- On mobile (<=768px), confirm the sidebar collapses to icons and the three-line collapse toggle is hidden.

Next steps / Suggestions
------------------------
- Consolidate any duplicate JS (e.g., `script-contact.js`) into `script.js` for easier maintenance.
- Add unit or visual tests for responsive layouts and interactions.
- Persist sidebar collapsed state to localStorage for improved UX.

