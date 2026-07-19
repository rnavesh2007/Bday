# Birthday Surprise Website

A premium, black-and-gold, cinematic birthday surprise site. Password-gated,
with a candle-blowing cake, a confetti celebration, an opening envelope,
a typewriter letter, and an auto-loading memories gallery.

## 1. Set the password and names

Open `js/script.js` and edit the `CONFIG` object at the top:

```js
const CONFIG = {
  PASSWORD: "changeme",       // the secret word on the first screen
  HER_NAME: "My Love",        // shown on the celebration page
  YOUR_NAME: "Me",            // the letter's signature
  LETTER_TITLE_NAME: "You",   // "My Dearest ___"
  LETTER_LINES: [ ... ],      // your actual message, one array entry per line
};
```

The hint text on the password screen lives directly in `index.html`
(search for `hint-text`) — edit it to match whatever password you choose.

## 2. Add your photos and videos

Drop files into these folders using this naming pattern, and the gallery
picks them up automatically — no code edits needed:

```
assets/photos/photo1.jpg
assets/photos/photo2.jpg
assets/photos/photo3.png
...

assets/videos/video1.mp4
assets/videos/video2.mp4
...
```

Supported photo extensions: `.jpg .jpeg .png .webp`
Supported video extensions: `.mp4 .webm .mov`

The site checks for up to 40 photos and 40 videos on load and silently
skips any numbers that don't exist. If you'd rather use custom filenames,
list them explicitly in `CONFIG.PHOTO_FILENAMES` / `CONFIG.VIDEO_FILENAMES`
in `js/script.js`.

## 3. Add music and sound effects

Place these in `assets/music/` (all optional — the site works fine without
them, it just stays quiet):

```
assets/music/birthday.mp3    — background music, loops after unlock
assets/music/chime.mp3       — countdown tick
assets/music/blow.mp3        — candle blow-out sound
assets/music/page-turn.mp3   — envelope opening sound
```

## 4. Preview locally

Because the gallery uses `fetch()` to check which files exist, open this
with a local server rather than double-clicking `index.html`:

```bash
cd birthday
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 5. Deploy

**GitHub Pages:** push this folder to a repo, then enable Pages on the
`main` branch (root). **Netlify:** drag-and-drop the whole `birthday`
folder onto the Netlify dashboard, or connect the repo. No build step
is required — it's static HTML/CSS/JS.

## Notes

- Custom cursor only appears on desktop (mouse/trackpad); touch devices
  use the normal cursor.
- Reduced-motion preferences are respected — animations shorten automatically.
- If `canvas-confetti`, `GSAP`, or `AOS` (loaded from a CDN) fail to load —
  e.g. no internet connection — the site still works: a lightweight
  fallback confetti kicks in, and CSS-only transitions cover the rest.
