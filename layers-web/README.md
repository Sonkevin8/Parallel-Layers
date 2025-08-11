# Layers — Movement Web App

A striking, responsive web app for the "Layers" movement with events and RSVP, a merch showcase, and a mobile hamburger menu. Color palette: black / white with red accents inspired by `@parallel.layers`.

## Features
- Responsive layout with animated hamburger navigation
- Events grid with RSVP modal; attendee names saved to localStorage
- Merchandise showcase grid with pricing (placeholder actions)
- Smooth scrolling, accessible focus states, and clean typography

## Run locally
No build required. Open `index.html` directly, or serve the folder:

```bash
# From the repo root
cd layers-web
python3 -m http.server 5173
# then open http://localhost:5173 in your browser
```

Alternatively, use any static server (e.g., `npx serve`).

## Customize
- Edit events in `app.js` (the `events` array)
- Edit merchandise in `app.js` (the `merchandise` array)
- Tweak colors in `styles.css` (`:root` variables)

## Notes
- RSVP data is saved in your browser `localStorage` under keys like `layers_rsvp_<eventId>`
- To reset RSVPs for an event, run `localStorage.removeItem('layers_rsvp_layers-001')` in DevTools