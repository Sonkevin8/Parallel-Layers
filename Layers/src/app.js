/* Navigation: hamburger */
const hamburgerButton = document.getElementById('hamburger');
const siteNav = document.getElementById('site-nav');
if (hamburgerButton && siteNav) {
  const toggle = () => {
    const expanded = hamburgerButton.getAttribute('aria-expanded') === 'true';
    hamburgerButton.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  };
  hamburgerButton.addEventListener('click', toggle);
  siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (siteNav.classList.contains('open')) toggle();
  }));
}

/* Data */
const events = [
  {
    id: 'layers-001',
    title: 'Layered Frequencies',
    date: 'Fri, Sep 12',
    time: '21:00',
    location: 'Warehouse 7, Docklands',
    cover: 'https://images.unsplash.com/photo-1559525839-b184a4d6988f?q=80&w=1600&auto=format&fit=crop',
    description: 'Bass-forward night featuring parallel sets and live visuals.'
  },
  {
    id: 'layers-002',
    title: 'Redline Pop-up',
    date: 'Sat, Oct 04',
    time: '14:00',
    location: 'Atrium 3, City Core',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    description: 'Design drop + listening session. Limited tee release.'
  },
  {
    id: 'layers-003',
    title: 'Parallel Sessions',
    date: 'Thu, Nov 06',
    time: '19:00',
    location: 'Studio 11',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop',
    description: 'Conversation between producers + visual artists. RSVP only.'
  }
];

const merchandise = [
  { id: 'tee-001', title: 'LAYERS Tee — Core', price: 38, image: '', color: 'Core Black', href: '#' },
  { id: 'cap-001', title: 'Parallel Cap', price: 28, image: '', color: 'Black / Red', href: '#' },
  { id: 'hood-001', title: 'Signal Hoodie', price: 68, image: '', color: 'Ink', href: '#' },
  { id: 'print-001', title: 'Artifact Print A2', price: 24, image: '', color: 'Ivory', href: '#' },
  { id: 'sticker-001', title: 'Stickers Pack', price: 8, image: '', color: 'Redline', href: '#' },
  { id: 'bag-001', title: 'Transit Tote', price: 22, image: '', color: 'Black', href: '#' },
];

/* Helpers */
const storageKey = (eventId) => `layers_rsvp_${eventId}`;
const getAttendees = (eventId) => {
  try { return JSON.parse(localStorage.getItem(storageKey(eventId)) || '[]'); } catch { return []; }
};
const addAttendee = (eventId, name) => {
  const list = getAttendees(eventId);
  list.push(name);
  localStorage.setItem(storageKey(eventId), JSON.stringify(list));
  return list;
};

/* Render: Events */
const eventsGrid = document.getElementById('events-grid');
function renderEvents(){
  if (!eventsGrid) return;
  eventsGrid.innerHTML = '';
  events.forEach(evt => {
    const attendees = getAttendees(evt.id);
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-media" style="background-image:url('${evt.cover}'); background-size:cover; background-position:center"></div>
      <div class="card-body">
        <h3 class="card-title">${evt.title}</h3>
        <div class="card-meta">${evt.date} • ${evt.time} — ${evt.location}</div>
        <p class="muted">${evt.description}</p>
      </div>
      <div class="card-actions">
        <span class="badge" title="Attendees"><span class="dot"></span><span class="attendee-count" data-eid="${evt.id}">${attendees.length}</span></span>
        <button class="btn btn-primary" data-rsvp="${evt.id}">I\'m attending</button>
        <button class="btn btn-ghost" data-viewatt="${evt.id}">View list</button>
        <span class="badge badge-inline">ID: ${evt.id}</span>
      </div>
    `;
    eventsGrid.appendChild(card);
  });
}
renderEvents();

/* RSVP Modal logic */
const modal = document.getElementById('rsvp-modal');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
const rsvpForm = document.getElementById('rsvp-form');
const rsvpName = document.getElementById('rsvp-name');
let activeEventId = null;

function openModal(eventId){
  activeEventId = eventId;
  const evt = events.find(e => e.id === eventId);
  if (evt){
    modalTitle.textContent = `RSVP — ${evt.title}`;
    modalSubtitle.textContent = `${evt.date} • ${evt.time} — ${evt.location}`;
  }
  rsvpName.value = '';
  if (typeof modal.showModal === 'function') modal.showModal(); else modal.classList.remove('hidden');
  rsvpName.focus();
}
function closeModal(){
  activeEventId = null;
  if (typeof modal.close === 'function') modal.close(); else modal.classList.add('hidden');
}

modalClose?.addEventListener('click', closeModal);
modalCancel?.addEventListener('click', closeModal);

rsvpForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = rsvpName.value.trim();
  if (!name || !activeEventId) return;
  const updated = addAttendee(activeEventId, name);
  const countEl = document.querySelector(`.attendee-count[data-eid="${activeEventId}"]`);
  if (countEl) countEl.textContent = String(updated.length);
  closeModal();
  // optional toast
  const t = document.createElement('div');
  t.textContent = `Added ${name} to the list.`;
  Object.assign(t.style, { position:'fixed', left:'50%', transform:'translateX(-50%)', bottom:'18px', background:'var(--card)', border:'1px solid var(--border)', padding:'10px 12px', borderRadius:'12px', zIndex:60 });
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1600);
});

/* Click handlers for RSVP and View list */
window.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const rsvpId = target.getAttribute('data-rsvp');
  if (rsvpId){
    openModal(rsvpId);
    return;
  }
  const viewId = target.getAttribute('data-viewatt');
  if (viewId){
    const list = getAttendees(viewId);
    if (list.length === 0) { alert('No attendees yet. Be the first.'); return; }
    alert(`Attendees ("${viewId}")\n\n` + list.map((n, i) => `${i+1}. ${n}`).join('\n'));
  }
});

/* Render: Merch */
const merchGrid = document.getElementById('merch-grid');
function renderMerch(){
  if (!merchGrid) return;
  merchGrid.innerHTML = '';
  merchandise.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    const artBg = `linear-gradient(135deg, rgba(255,42,42,.28), transparent 60%), #0f0f0f`;
    card.innerHTML = `
      <div class="card-media" style="background:${artBg}; display:grid; place-items:center">
        <div style="font-family:Bebas Neue, Impact, system-ui; letter-spacing:.08em; font-size: clamp(24px, 4vw, 42px); color: var(--fg); opacity:.9;">
          ${item.title.replace('LAYERS ','')}
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <div class="card-meta">${item.color}</div>
      </div>
      <div class="card-actions">
        <span class="price">$${item.price}</span>
        <a class="btn btn-ghost" href="${item.href}" aria-disabled="true" onclick="event.preventDefault(); alert('Store coming soon. Follow @parallel.layers');">View</a>
        <button class="btn btn-primary" onclick="alert('Store coming soon. Follow @parallel.layers');">Buy</button>
      </div>
    `;
    merchGrid.appendChild(card);
  });
}
renderMerch();

/* Smooth scroll offset for fixed header */
const adjustHashScroll = () => {
  const hash = window.location.hash;
  if (!hash) return;
  const el = document.querySelector(hash);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top, behavior: 'instant' });
};
window.addEventListener('hashchange', () => setTimeout(adjustHashScroll));
window.addEventListener('load', () => setTimeout(adjustHashScroll));