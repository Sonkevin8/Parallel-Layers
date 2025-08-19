Parallel Layers — static website

How to run

- Open `index.html` directly in your browser, or
- Serve this folder with any static server, for example:

```bash
python3 -m http.server 8080 --directory /workspace
```

Project structure

- `index.html`: Markup and sections
- `styles.css`: Visual design and layout
- `script.js`: Interactions, localStorage for layers, smooth scroll

Notes

- No build step or external dependencies are required.
- The “Get updates” form uses a `mailto:` fallback so it works without a backend. Replace the address in `script.js` with a real inbox or hook up a service like Formspree.

