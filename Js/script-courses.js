/* =========================================
   courses-page script.js
   - Dynamic courses rendering
   - Search, filter, sort
   - Modal preview (before download/enroll)
   - Mobile collapsible sections
   - Reusable functions, no global leaks
   ========================================= */

(function () {
  'use strict';

  /** -----------------------------
   * CONFIG & DATA
   * ------------------------------
   * Replace image / pdf links with your real assets later.
   */
  const COURSES = [
    // FRONTEND
    { id: 'html', title: 'HTML', category: 'Frontend',
      img: 'https://via.placeholder.com/720x360.png?text=HTML', desc: 'Learn the foundation of web pages: structure, semantics, and accessibility.' },

    { id: 'css', title: 'CSS', category: 'Frontend',
      img: 'https://via.placeholder.com/720x360.png?text=CSS', desc: 'Style responsive layouts with Flexbox, Grid, and modern CSS techniques.' },

    { id: 'javascript', title: 'JavaScript', category: 'Frontend',
      img: 'https://via.placeholder.com/720x360.png?text=JavaScript', desc: 'Make interactive web experiences using DOM, events and ES6+ features.' },

    { id: 'react', title: 'React', category: 'Frontend',
      img: 'https://via.placeholder.com/720x360.png?text=React', desc: 'Build component-driven user interfaces with hooks and state management.' },

    { id: 'bootstrap', title: 'Bootstrap', category: 'Frontend',
      img: 'https://via.placeholder.com/720x360.png?text=Bootstrap', desc: 'Quickly prototype responsive UIs with a popular CSS framework.' },

    { id: 'typescript', title: 'TypeScript', category: 'Frontend',
      img: 'https://via.placeholder.com/720x360.png?text=TypeScript', desc: 'Add static types to JavaScript for safer and scalable codebases.' },

    // BACKEND
    { id: 'nodejs', title: 'Node.js', category: 'Backend',
      img: 'https://via.placeholder.com/720x360.png?text=Node.js', desc: 'Event-driven server-side JavaScript runtime for building fast APIs.' },

    { id: 'express', title: 'Express.js', category: 'Backend',
      img: 'https://via.placeholder.com/720x360.png?text=Express.js', desc: 'Minimal and flexible Node framework for building web servers and APIs.' },

    { id: 'django', title: 'Django', category: 'Backend',
      img: 'https://via.placeholder.com/720x360.png?text=Django', desc: 'High-level Python framework for rapid, secure web development.' },

    // DATABASE
    { id: 'mongodb', title: 'MongoDB', category: 'Database',
      img: 'https://via.placeholder.com/720x360.png?text=MongoDB', desc: 'NoSQL document database — schemas, queries and indexing.' },

    { id: 'nosql', title: 'NoSQL', category: 'Database',
      img: 'https://via.placeholder.com/720x360.png?text=NoSQL', desc: 'Understand flexible schemas and modern storage patterns beyond SQL.' },

    // TOOLS / EXTRAS
    { id: 'git', title: 'Git & GitHub', category: 'Tools',
      img: 'https://via.placeholder.com/720x360.png?text=Git+%26+GitHub', desc: 'Version control, branching workflows and collaboration on GitHub.' },

    { id: 'vscode', title: 'VS Code', category: 'Tools',
      img: 'https://via.placeholder.com/720x360.png?text=VS+Code', desc: 'Work faster with editor shortcuts, extensions and debugging tools.' },

    { id: 'ai', title: 'AI Integrations', category: 'Tools',
      img: 'https://via.placeholder.com/720x360.png?text=AI+Integrations', desc: 'Leverage AI APIs and tools (concepts only) to boost developer productivity.' },

    { id: 'figma', title: 'Figma Design', category: 'Tools',
      img: 'https://via.placeholder.com/720x360.png?text=Figma', desc: 'UI/UX prototyping, components and design systems for collaboration.' },

    // ROADMAPS (treated as downloadable items)
    { id: 'roadmap-frontend', title: 'Frontend Roadmap', category: 'Roadmap',
      img: 'https://via.placeholder.com/720x360.png?text=Frontend+Roadmap', desc: 'Step-by-step path to become a frontend developer.', pdf: 'roadmaps/frontend.pdf' },

    { id: 'roadmap-backend', title: 'Backend Roadmap', category: 'Roadmap',
      img: 'https://via.placeholder.com/720x360.png?text=Backend+Roadmap', desc: 'Path to backend development: Node, API design, security.', pdf: 'roadmaps/backend.pdf' },

    { id: 'roadmap-fullstack', title: 'Fullstack Roadmap', category: 'Roadmap',
      img: 'https://via.placeholder.com/720x360.png?text=Fullstack+Roadmap', desc: 'Combine frontend & backend skills to build fullstack projects.', pdf: 'roadmaps/fullstack.pdf' }
  ];

  const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools', 'Roadmap'];

  /** -----------------------------
   * UTILITY / REUSABLE FUNCTIONS
   * ------------------------------ */

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.keys(attrs).forEach((k) => {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'dataset') {
        Object.entries(attrs[k]).forEach(([dataKey, dataVal]) => node.dataset[dataKey] = dataVal);
      } else if (k === 'html') {
        node.innerHTML = attrs[k];
      } else {
        node.setAttribute(k, attrs[k]);
      }
    });
    (Array.isArray(children) ? children : [children]).forEach(child => {
      if (typeof child === 'string') node.appendChild(document.createTextNode(child));
      else if (child instanceof Node) node.appendChild(child);
    });
    return node;
  }

  // Debounce for search input
  function debounce(fn, wait = 200) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /** -----------------------------
   * RENDERING: build page contents
   * ------------------------------ */

  // Main init
  function initCoursesPage() {
    const container = document.querySelector('.courses-container');
    if (!container) {
      console.warn('courses-container not found - aborting courses script.');
      return;
    }

    // Create control bar (search / filter / sort)
    const controls = buildControls();
    container.appendChild(controls);

    // Create sections for each category
    CATEGORIES.forEach(cat => {
      const section = buildSection(cat);
      container.appendChild(section);
    });

    // Render courses into sections
    renderAllCourses();

    // Add modal element (hidden)
    createModal();

    // Wire up mobile collapsible sections
    initCollapsibleSections();

    // Make search live
    initSearch();

    // Init filtering UI
    initFilterButtons();

    // Init sort options
    initSortControls();
  }

  // Build control bar (search / filter / sort)
  function buildControls() {
    const wrapper = el('div', { class: 'courses-controls', role: 'toolbar' });

    // Search input
    const searchWrap = el('div', { class: 'control search-control' });
    const searchInput = el('input', { type: 'search', placeholder: 'Search courses (e.g. React, Node)', id: 'courseSearch' });
    searchWrap.appendChild(searchInput);

    // Filter buttons (All + each category)
    const filterWrap = el('div', { class: 'control filter-control' });
    const filterAll = el('button', { class: 'filter-btn active', 'data-filter': 'All', type: 'button' }, 'All');
    filterWrap.appendChild(filterAll);
    CATEGORIES.forEach(cat => {
      const b = el('button', { class: 'filter-btn', 'data-filter': cat, type: 'button' }, cat);
      filterWrap.appendChild(b);
    });

    // Sort select
    const sortWrap = el('div', { class: 'control sort-control' });
    const sortSelect = el('select', { id: 'courseSort' });
    sortSelect.appendChild(el('option', { value: 'recommended' }, 'Recommended'));
    sortSelect.appendChild(el('option', { value: 'az' }, 'A → Z'));
    sortSelect.appendChild(el('option', { value: 'za' }, 'Z → A'));
    sortWrap.appendChild(sortSelect);

    // Append controls: search | filters | sort
    wrapper.appendChild(searchWrap);
    wrapper.appendChild(filterWrap);
    wrapper.appendChild(sortWrap);

    // minimal styles hook (in case you want to style)
    wrapper.classList.add('courses-controls-wrapper');

    return wrapper;
  }

  // Build a section container for a category
  function buildSection(category) {
    const section = el('section', { class: 'course-section', id: `section-${category.toLowerCase()}` });
    const h2 = el('h2', {}, category + (category === 'Roadmap' ? 's' : ''));
    section.appendChild(h2);

    // collapsible icon for mobile
    const collapseBtn = el('button', { class: 'section-collapse', 'aria-expanded': 'true', type: 'button' }, 'Toggle');
    // We'll show this button via CSS on small screens
    section.appendChild(collapseBtn);

    const grid = el('div', { class: 'course-grid', id: `${category.toLowerCase()}-grid` });
    section.appendChild(grid);

    return section;
  }

  // Render all courses data into their category grids
  function renderAllCourses(filter = 'All', searchTerm = '', sortBy = 'recommended') {
    // build map of category -> element
    const map = {};
    CATEGORIES.forEach(cat => {
      const grid = document.getElementById(`${cat.toLowerCase()}-grid`);
      if (grid) map[cat] = grid;
    });

    // Clear grids
    Object.values(map).forEach(g => g.innerHTML = '');

    // Filter + search + sort
    let items = COURSES.slice();

    // Search filter (case-insensitive)
    if (searchTerm && searchTerm.trim()) {
      const s = searchTerm.trim().toLowerCase();
      items = items.filter(c => (c.title + ' ' + c.desc + ' ' + c.category).toLowerCase().includes(s));
    }

    // Category filter
    if (filter && filter !== 'All') {
      items = items.filter(c => c.category === filter);
    }

    // Sorting
    if (sortBy === 'az') items.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'za') items.sort((a, b) => b.title.localeCompare(a.title));
    // recommended = keep original order

    // Render into map; if category not present, push to Tools as fallback
    items.forEach(course => {
      const grid = map[course.category] || map['Tools'];
      if (grid) grid.appendChild(createCourseCard(course));
    });

    // If a grid is empty, show a friendly message
    Object.entries(map).forEach(([cat, grid]) => {
      if (!grid.children.length) {
        const note = el('div', { class: 'empty-note' }, `No ${cat} courses found.`);
        grid.appendChild(note);
      }
    });
  }

  // Create a course card element
  function createCourseCard(course) {
    const card = el('article', { class: 'course-card', dataset: { id: course.id, category: course.category } });

    // image
    const img = el('img', { src: course.img || 'https://via.placeholder.com/720x360.png?text=Course', alt: course.title + ' image' });

    // content
    const body = el('div', { class: 'course-content' });
    const title = el('h3', {}, course.title);
    const desc = el('p', {}, course.desc);

    // Controls: Enroll button + preview (for roadmap use download link)
    const actions = el('div', { class: 'course-actions' });

    const enrollBtn = el('button', { class: 'enroll-btn', type: 'button' }, 'ENROLL NOW');
    // enroll click -> show modal preview
    enrollBtn.addEventListener('click', () => showCourseModal(course));

    actions.appendChild(enrollBtn);

    // For roadmap items, show a Download button instead of (or in addition)
    if (course.category === 'Roadmap' && course.pdf) {
      const dl = el('a', { class: 'download-btn', href: course.pdf, download: '' }, 'Download Roadmap');
      // But to comply with "show a modal preview first", override actual download to show modal preview with embedded PDF
      dl.addEventListener('click', (e) => {
        e.preventDefault();
        showRoadmapModal(course);
      });
      actions.appendChild(dl);
    }

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(actions);

    card.appendChild(img);
    card.appendChild(body);

    return card;
  }

  /** -----------------------------
   * MODAL (Preview)
   * ------------------------------ */

  function createModal() {
    // avoid duplicates
    if (document.getElementById('coursesModal')) return;

    const modal = el('div', { id: 'coursesModal', class: 'courses-modal', 'aria-hidden': 'true' });
    const inner = el('div', { class: 'courses-modal-inner' });

    const closeBtn = el('button', { class: 'modal-close', 'aria-label': 'Close preview' }, '×');
    closeBtn.addEventListener('click', hideModal);

    const content = el('div', { class: 'modal-content-area' });

    inner.appendChild(closeBtn);
    inner.appendChild(content);
    modal.appendChild(inner);
    document.body.appendChild(modal);

    // click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });
  }

  function showModal(htmlContent = '') {
    const modal = document.getElementById('coursesModal');
    if (!modal) return;
    const contentArea = modal.querySelector('.modal-content-area');
    contentArea.innerHTML = ''; // clear
    if (typeof htmlContent === 'string') contentArea.innerHTML = htmlContent;
    else contentArea.appendChild(htmlContent);

    modal.classList.add('open'); // CSS should animate .open
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function hideModal() {
    const modal = document.getElementById('coursesModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // restore
  }

  // Show course preview modal (used for ENROLL click)
  function showCourseModal(course) {
    const content = el('div', { class: 'modal-preview' });

    const img = el('img', { src: course.img, alt: course.title + ' preview', style: 'width:100%;max-height:240px;object-fit:cover;border-radius:8px;margin-bottom:12px;' });
    const title = el('h3', {}, course.title);
    const desc = el('p', {}, course.desc);
    const meta = el('p', { class: 'muted' }, `Category: ${course.category}`);

    const enrollConfirm = el('button', { class: 'modal-enroll', type: 'button' }, 'Confirm Enroll');
    enrollConfirm.addEventListener('click', () => {
      // Example simple feedback flow — replace with real enroll logic
      enrollConfirm.textContent = 'Enrolled ✓';
      enrollConfirm.disabled = true;
      enrollConfirm.classList.add('enrolled');
      setTimeout(hideModal, 1200);
    });

    const cancel = el('button', { class: 'modal-cancel', type: 'button' }, 'Close');
    cancel.addEventListener('click', hideModal);

    content.appendChild(img);
    content.appendChild(title);
    content.appendChild(desc);
    content.appendChild(meta);
    content.appendChild(el('div', { class: 'modal-actions' }, [enrollConfirm, cancel]));

    showModal(content);
  }

  // Show roadmap preview modal (embed pdf preview using <iframe> if pdf exists)
  function showRoadmapModal(course) {
    const content = el('div', { class: 'modal-preview' });

    const title = el('h3', {}, course.title);
    const desc = el('p', {}, course.desc);
    content.appendChild(title);
    content.appendChild(desc);

    if (course.pdf) {
      // embed pdf preview (browser-dependent, may need actual file and CORS)
      const frameWrap = el('div', { style: 'width:100%;height:320px;margin:12px 0;background:#000;border-radius:8px;overflow:hidden;' });
      const iframe = el('iframe', { src: course.pdf, style: 'width:100%;height:100%;border:0;' });
      frameWrap.appendChild(iframe);
      content.appendChild(frameWrap);
    } else {
      content.appendChild(el('p', {}, 'No preview available.'));
    }

    const download = el('a', { class: 'download-btn', href: course.pdf || '#', download: '' }, 'Download PDF');
    download.addEventListener('click', (e) => {
      // allow default if real URL, otherwise just close
      hideModal();
    });

    const close = el('button', { class: 'modal-cancel' }, 'Close');
    close.addEventListener('click', hideModal);

    content.appendChild(el('div', { class: 'modal-actions' }, [download, close]));

    showModal(content);
  }

  /** -----------------------------
   * SEARCH, FILTER & SORT INIT
   * ------------------------------ */

  function initSearch() {
    const searchInput = document.getElementById('courseSearch');
    if (!searchInput) return;

    const handler = debounce(function (e) {
      const q = e.target.value;
      const activeFilterBtn = document.querySelector('.filter-btn.active');
      const filter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'All';
      const sortVal = document.getElementById('courseSort') ? document.getElementById('courseSort').value : 'recommended';
      renderAllCourses(filter, q, sortVal);
    }, 250);

    searchInput.addEventListener('input', handler);
  }

  function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        // remove active
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // apply filter
        const filter = this.dataset.filter || 'All';
        const q = (document.getElementById('courseSearch') || { value: '' }).value;
        const sortVal = document.getElementById('courseSort') ? document.getElementById('courseSort').value : 'recommended';
        renderAllCourses(filter, q, sortVal);
      });
    });
  }

  function initSortControls() {
    const sel = document.getElementById('courseSort');
    if (!sel) return;
    sel.addEventListener('change', function () {
      const filter = (document.querySelector('.filter-btn.active') || { dataset: { filter: 'All' } }).dataset.filter;
      const q = (document.getElementById('courseSearch') || { value: '' }).value;
      renderAllCourses(filter, q, this.value);
    });
  }

  /** -----------------------------
   * MOBILE: Collapsible Sections
   * ------------------------------ */

  function initCollapsibleSections() {
    const sections = document.querySelectorAll('.course-section');
    sections.forEach(section => {
      const btn = section.querySelector('.section-collapse');
      const grid = section.querySelector('.course-grid');
      // Hide button if grid is large screen (CSS will control visibility); keep logic always
      if (!btn || !grid) return;
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        grid.style.display = expanded ? 'none' : ''; // simple toggle; CSS handles nice transitions
      });
    });

    // On small screens, collapse all by default (optional)
    if (window.matchMedia && window.matchMedia('(max-width: 600px)').matches) {
      sections.forEach(section => {
        const btn = section.querySelector('.section-collapse');
        const grid = section.querySelector('.course-grid');
        if (btn && grid) {
          btn.setAttribute('aria-expanded', 'false');
          grid.style.display = 'none';
        }
      });
    }
  }

  /** -----------------------------
   * BOOTSTRAP / INIT
   * ------------------------------ */

  // Run once DOM is ready
  document.addEventListener('DOMContentLoaded', initCoursesPage);

  // Expose a tiny API for debugging from console (optional, non-conflicting)
  window.__LUKI_COURSES = {
    render: renderAllCourses,
    data: COURSES
  };

})(); // IIFE end
