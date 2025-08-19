// Parallel Layers — behavior

// Smooth scroll for internal anchors
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (href.length <= 1) return;
  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const navMenu = document.getElementById('navMenu');
    navMenu?.classList.remove('open');
    const toggle = document.querySelector('.nav-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const menu = document.getElementById('navMenu');
    const isOpen = menu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Reveal on scroll
const revealables = new Set();
document.querySelectorAll('.section, .card, .layer, [data-reveal]').forEach((el) => {
  el.setAttribute('data-reveal', '');
  revealables.add(el);
});
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
revealables.forEach((el) => io.observe(el));

// Helpers for localStorage
const storageKey = 'parallelLayers';
function getStoredLayers() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored layers', err);
    return [];
  }
}
function setStoredLayers(layers) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(layers));
  } catch (err) {
    console.error('Failed to store layers', err);
  }
}

// Seed example layers on first load
function seedIfEmpty() {
  const current = getStoredLayers();
  if (current.length > 0) return;
  const seeded = [
    {
      id: crypto.randomUUID(),
      name: 'Kai',
      title: 'Courtyard Jam',
      description: 'Brought instruments to the courtyard. Three neighbors joined; we made a loop and a new friend.',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6
    },
    {
      id: crypto.randomUUID(),
      name: 'Amara',
      title: 'Zine swap',
      description: 'Printed a tiny run of a feelings zine. Swapped with two artists; planning a group show.',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
    },
    {
      id: crypto.randomUUID(),
      name: 'Noor',
      title: 'Open studio night',
      description: 'Left the door open. Strangers walked in with tea and stories. A new collab emerged.',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1
    }
  ];
  setStoredLayers(seeded);
}

// Render layers
const layerList = document.getElementById('layerList');
function renderLayers() {
  if (!layerList) return;
  const layers = getStoredLayers().sort((a, b) => b.createdAt - a.createdAt);
  layerList.innerHTML = '';
  for (const layer of layers) {
    const li = document.createElement('li');
    li.className = 'layer';
    li.innerHTML = `
      <div class="meta">${escapeHtml(layer.name)} • ${timeAgo(layer.createdAt)}</div>
      <div class="title">${escapeHtml(layer.title)}</div>
      <div class="desc">${escapeHtml(layer.description)}</div>
    `;
    layerList.appendChild(li);
  }
}

// Escape HTML to prevent injection
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Time ago helper
function timeAgo(ts) {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  const intervals = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60]
  ];
  for (const [label, secs] of intervals) {
    const v = Math.floor(seconds / secs);
    if (v >= 1) return `${v} ${label}${v > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

// Handle layer form
const form = document.getElementById('layerForm');
const statusEl = document.getElementById('formStatus');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    if (!name || !title || !description) {
      setStatus('Please fill in all fields.', true);
      return;
    }
    const entry = { id: crypto.randomUUID(), name, title, description, createdAt: Date.now() };
    const layers = getStoredLayers();
    layers.push(entry);
    setStoredLayers(layers);
    form.reset();
    setStatus('Your layer is live!');
    renderLayers();
  });
}

function setStatus(msg, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.color = isError ? '#fda4af' : '#a7f3d0';
  setTimeout(() => { statusEl.textContent = ''; }, 3500);
}

// Subscribe form (uses mailto fallback + local success message)
const subscribeForm = document.getElementById('subscribeForm');
const subscribeEmail = document.getElementById('subscribeEmail');
const subscribeStatus = document.getElementById('subscribeStatus');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = subscribeEmail.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      subscribeStatus.textContent = 'Please enter a valid email.';
      return;
    }
    subscribeStatus.textContent = 'Thanks! Check your email for a hello from us.';
    // Open the default email client as a simple, backend-free way to say hello
    const subject = encodeURIComponent('Join Parallel Layers');
    const body = encodeURIComponent(`Hi Parallel Layers,\n\nI want to join. My email is ${email}.`);
    window.location.href = `mailto:hello@parallellayers.local?subject=${subject}&body=${body}`;
    subscribeForm.reset();
  });
}

// Footer year
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

// Init
seedIfEmpty();
renderLayers();

