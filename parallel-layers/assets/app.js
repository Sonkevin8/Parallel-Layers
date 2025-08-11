const STORAGE_KEYS = {
  events: 'pl_events_v1',
  comments: 'pl_comments_v1',
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function formatDateHuman(value) {
  try {
    const d = new Date(value);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return value;
  }
}

function seedDemoContent() {
  const events = readStorage(STORAGE_KEYS.events, []);
  if (events.length === 0) {
    const today = new Date();
    const plus = (days) => new Date(today.getTime() + days * 86400000).toISOString().slice(0, 10);
    const demo = [
      {
        id: crypto.randomUUID(),
        title: 'Layered Opening Night',
        date: plus(7),
        location: 'Warehouse 17, Docklands',
        image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop',
        desc: 'Sound, light, motion. Kick-off night for the season.'
      },
      {
        id: crypto.randomUUID(),
        title: 'Kinetic Workshop',
        date: plus(21),
        location: 'Studio Beta',
        image: 'https://images.unsplash.com/photo-1520975922137-8bdf0a1cfb08?q=80&w=1200&auto=format&fit=crop',
        desc: 'Build kinetic pieces with local artists and technologists.'
      },
      {
        id: crypto.randomUUID(),
        title: 'Parallel Parade',
        date: plus(35),
        location: 'City Arts Promenade',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop',
        desc: 'Community procession and pop-up performances.'
      }
    ];
    writeStorage(STORAGE_KEYS.events, demo);
  }

  const comments = readStorage(STORAGE_KEYS.comments, []);
  if (comments.length === 0) {
    const demoComments = [
      {
        id: crypto.randomUUID(),
        name: 'Ari',
        event: 'Opening Night',
        text: 'The energy was unreal. Red lights and bass all night.',
        createdAt: Date.now()
      },
      {
        id: crypto.randomUUID(),
        name: 'Maya',
        event: 'Kinetic Workshop',
        text: 'Built my first moving sculpture. So many helpful people.',
        createdAt: Date.now()
      }
    ];
    writeStorage(STORAGE_KEYS.comments, demoComments);
  }
}

function renderEvents() {
  const grid = document.getElementById('eventsGrid');
  const events = readStorage(STORAGE_KEYS.events, []);
  grid.innerHTML = '';
  events
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((evt) => {
      const card = document.createElement('article');
      card.className = 'event-card';
      card.innerHTML = `
        <div class="event-media">${evt.image ? `<img src="${evt.image}" alt="${evt.title} poster"/>` : '<div style="color:#bbb">Artwork</div>'}</div>
        <div class="event-badge">NEW</div>
        <div class="event-body">
          <h3 class="event-title">${evt.title}</h3>
          <div class="event-meta">
            <span>${formatDateHuman(evt.date)}</span>
            <span>•</span>
            <span>${evt.location}</span>
          </div>
          <div class="event-desc">${evt.desc}</div>
          <div class="event-actions">
            <button class="btn small" data-action="share" data-id="${evt.id}">Share</button>
            <button class="btn small ghost" data-action="remove" data-id="${evt.id}">Remove</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
}

function renderComments() {
  const list = document.getElementById('commentsList');
  const comments = readStorage(STORAGE_KEYS.comments, []);
  list.innerHTML = '';
  comments
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((c) => {
      const li = document.createElement('li');
      li.className = 'comment-item';
      li.innerHTML = `
        <div class="comment-head">
          <div class="avatar" aria-hidden="true"></div>
          <div class="comment-meta"><strong>${c.name}</strong> on <em>${c.event}</em> • ${new Date(c.createdAt).toLocaleString()}</div>
        </div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
      `;
      list.appendChild(li);
    });
}

function escapeHtml(str) {
  const p = document.createElement('p');
  p.innerText = str;
  return p.innerHTML;
}

function setupEventModal() {
  const modal = document.getElementById('eventFormModal');
  const addBtn = document.getElementById('addEventBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const cancelBtn = document.getElementById('cancelEventBtn');
  const form = document.getElementById('eventForm');

  const open = () => { modal.showModal(); addBtn.setAttribute('aria-expanded', 'true'); };
  const close = () => { modal.close(); addBtn.setAttribute('aria-expanded', 'false'); form.reset(); };

  addBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const location = document.getElementById('eventLocation').value.trim();
    const image = document.getElementById('eventImage').value.trim();
    const desc = document.getElementById('eventDesc').value.trim();
    if (!title || !date || !location || !desc) return;

    const events = readStorage(STORAGE_KEYS.events, []);
    events.push({ id: crypto.randomUUID(), title, date, location, image, desc });
    writeStorage(STORAGE_KEYS.events, events);
    renderEvents();
    close();
  });
}

function setupEventActions() {
  const grid = document.getElementById('eventsGrid');
  grid.addEventListener('click', async (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const action = target.getAttribute('data-action');
    const id = target.getAttribute('data-id');
    if (!action || !id) return;

    if (action === 'remove') {
      const events = readStorage(STORAGE_KEYS.events, []);
      writeStorage(STORAGE_KEYS.events, events.filter((ev) => ev.id !== id));
      renderEvents();
    }

    if (action === 'share') {
      const events = readStorage(STORAGE_KEYS.events, []);
      const ev = events.find((ev) => ev.id === id);
      if (!ev) return;
      const text = `${ev.title} — ${formatDateHuman(ev.date)} @ ${ev.location}\n${ev.desc}`;
      if (navigator.share) {
        try { await navigator.share({ title: ev.title, text }); } catch {}
      } else {
        await navigator.clipboard.writeText(text);
        target.textContent = 'Copied';
        setTimeout(() => (target.textContent = 'Share'), 1000);
      }
    }
  });
}

function setupComments() {
  const form = document.getElementById('commentForm');
  const name = document.getElementById('commentName');
  const eventInput = document.getElementById('commentEvent');
  const text = document.getElementById('commentText');
  const clearBtn = document.getElementById('clearCommentsBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const c = {
      id: crypto.randomUUID(),
      name: name.value.trim() || 'Anonymous',
      event: eventInput.value.trim() || 'An event',
      text: text.value.trim(),
      createdAt: Date.now(),
    };
    if (!c.text) return;
    const list = readStorage(STORAGE_KEYS.comments, []);
    list.push(c);
    writeStorage(STORAGE_KEYS.comments, list);
    text.value = '';
    renderComments();
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('Clear all comments?')) {
      writeStorage(STORAGE_KEYS.comments, []);
      renderComments();
    }
  });
}

function setupTicker() {
  const track = document.getElementById('tickerTrack');
  let speed = 1;
  let pos = 0;
  function step() {
    pos -= speed;
    track.style.transform = `translateX(${pos}px)`;
    if (Math.abs(pos) > track.scrollWidth / 2) pos = 0;
    requestAnimationFrame(step);
  }
  step();
}

function initYear() {
  const y = document.getElementById('year');
  y.textContent = new Date().getFullYear();
}

function main() {
  seedDemoContent();
  initYear();
  renderEvents();
  renderComments();
  setupEventModal();
  setupEventActions();
  setupComments();
  setupTicker();
}

window.addEventListener('DOMContentLoaded', main);