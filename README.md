# Portfolio

Charné Janse van Rensburg's portfolio site. Plain HTML, CSS and JavaScript with no build step.

**Live at [st10089153.github.io](https://st10089153.github.io)**

## Run it locally

```
python -m http.server 5178 --directory portfolio
```

Then open http://localhost:5178.

## Files

- `index.html`: all the page content
- `styles.css`: the look (colours are CSS variables at the top; the light "paper" theme is under `[data-theme="paper"]`)
- `main.js`: the interactions. Case study text lives in `PROJECTS` and the keypad skills in `SKILLS` at the top of the file
- `assets/img/`: screenshots, exported to WebP from each project's repo

## What's in it

- Preloader (only on the first visit in a session)
- Three cursors: ink arrow, 8-bit arrow, or the system cursor (picker in the top right)
- Name in a variable font whose letters get heavier near the pointer, and breathe on their own on phones
- Selected work cards that scroll over a giant sticky title, each opening a full case study
- A keypad of skills: click the keys or type 1–5, Q–T, A–G, Z–B. Each key has its own click and note, and the knob spins through them
- Dark and paper themes, a live SAST clock, and click-to-copy email
- Respects "reduce motion", and works with keyboard only

Smooth scrolling uses [Lenis](https://github.com/darkroomengineering/lenis) from a CDN. If it can't load, the page falls back to normal scrolling.

## Deploy

The site is served by GitHub Pages from the `main` branch of this repo. To update it, commit and push to `main`; the new version is live a minute or two later.
