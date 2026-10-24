# 🐊 Ivan's Style Swamp: Roadmap

**Status:** Proposed. Nothing here is scheduled or approved yet.

**Last updated:** 2026-10-21

This file lists known issues and proposed ideas for Ivan's Style Swamp. It does not describe how the app works today; see the [README](README.md) for that.

---

## 🎯 Purpose

Style Swamp is meant to be silly and fun: dress up Ivan the Gator and save the look. Many outfits and backgrounds already match trades and electives the school promotes, such as chef and kitchen, welder and welding shop, woodshop, tailor shop, golf and art gallery.

The app has a second job. It shows students that an app is code they can change, to spark interest in learning to code at Compass. Adding an outfit is as simple as dropping a PNG in a folder, which makes it an easy first contribution.

**Call-to-action wording:**
- Point players to **Compass Code**, the school's self-guided coding course.
- Say "self-guided course", not "coding class", until a real coding elective exists.
- The course link is not final. Use one placeholder link everywhere until it is picked.

---

## 🛠 Promo-Ready Fixes (Do These First)

Checked against `src/App.jsx` and `index.html` on 2026-10-21. Fix these before any post or link sends students here to share their looks.

| # | Issue | What happens | Where |
| :--- | :--- | :--- | :--- |
| 1 | **Snapshot drops the background and stretches Ivan** | `handleSnapshot` makes a 1080x1920 canvas, leaves `outfit.bg` out of the layer list, and draws every layer with `drawImage(img, 0, 0, 1080, 1920)`. All layer art is 1080x1080, so the saved PNG has no background and Ivan is stretched about 1.78x tall. An uploaded custom base is stretched too. The screen looks right because the stage uses `object-contain`. | `handleSnapshot` in `src/App.jsx` |
| 2 | **Default background is Art Gallery** | The startup defaults and `handleReset` look for a background whose name contains "school". No file matches, so both fall back to the first background, `artgallery.png`. | `src/App.jsx` |
| 3 | **Scaffold tab title and favicon** | The tab still reads `ivans-style-swamp` and shows the Vite logo (`/vite.svg`). There is no meta description or share image. | `index.html`, `public/` |
| 4 | **README out of date** | It says only the face is mandatory and always randomized; legs and body are too. It says the item grid has 4 columns on mobile; it has 3, then 4 from the `sm` breakpoint. It lists "Happy, Cool" faces; only `cool.png` exists. It says Save composites all layers; the background is left out. It lists `App.css` as app styles; nothing imports it. | `README.md` |
| 5 | **Icon-only mobile buttons have no names** | The mobile Upload, Reset and floating Randomize buttons show only an icon, with no `aria-label` or `title`, so screen readers can't name them. The desktop buttons have `title`. | Mobile header and stage in `src/App.jsx` |
| 6 | **Failure alert says "Snapshot complete"** | If a layer image fails to load, the alert reads "Snapshot complete but auto-download failed", although no snapshot was made. | `handleSnapshot` in `src/App.jsx` |

### Suggested fixes
1. Draw the background first. If it's NONE, draw the same teal-to-green gradient the stage shows. Then either export a square 1080x1080 image, or keep the 1080x1920 portrait and center the square art on it. Update the README to match.
2. Choose the default background on purpose (for example `swamp.png` or `classroom.png`) and use one constant for both startup and Reset.
3. Set the title to "Ivan's Style Swamp", add a Compass or gator favicon to `public/`, and add a short meta description.
4. Refresh the README after fixes 1 and 2.
5. Give each icon-only control a name: "Upload base image", "Reset outfit", "Randomize outfit". Use `aria-label` and `title` on the Reset and Randomize buttons. Upload is a `<label>` around a hidden file input, so add visually hidden text inside it (for example Tailwind's `sr-only`) instead of an `aria-label`.
6. Change the alert to say the snapshot failed and to try again.

### Polish (optional)
- Labels come from file names, and joined words aren't split, so buttons read "Artgallery", "Weldingshop" and "Classroom1" to "Classroom8". Renaming files (for example `art_gallery.png`) fixes the labels, and the nine classroom backgrounds need names people can tell apart.
- Consider moving the chartreuse (`#7FFF00`) and `blue-500` accents to the school's official colors.
- Check short screens. The card has `min-h-[600px]` and the page can't scroll (`html` and `body` are `position: fixed` with `overflow: hidden` in `src/index.css`), so part of the UI may be cut off on a landscape phone. Not yet tested.

---

## 🔧 Upkeep

- **Node 20 in CI.** `.github/workflows/ci.yml` pins `node-version: '20'`, and Node 20 reached end of life on 2026-04-30. Move to Node 22 or 24. Also bump `actions/checkout@v4` and `actions/setup-node@v4`, which run on the Node 20 Actions runtime that GitHub is phasing out.
- **Almost no tests.** `src/App.test.jsx` renders the app and only checks that `document.body` exists. Add a few feature tests: face, legs and body can't be removed; Reset restores the default background; the snapshot includes the background. `@testing-library/jest-dom` is in `package.json` but not set up.
- **One big file.** All logic and UI live in `src/App.jsx` (457 lines). The layer order is written out twice, in `IvanRenderer` and in `handleSnapshot`. Adding a category means hand edits in about 6 to 8 places: the globs, `ASSETS`, `CATEGORIES`, outfit state, the renderer, the snapshot, Randomize and Reset. One shared layer list, and moving the renderer and snapshot into their own files, would make the next category safer.
- **Leftovers.** `src/App.css` isn't imported anywhere. CI and `npm run deploy` both publish to `gh-pages`, so one of them could go. The Illustrator source art is gitignored, so keep a shared backup of it.

---

## 💡 Ideas

All proposed. The quick win comes first; the rest follow the priority order from the games and promotion ideas review. Ideas 3 and 4 depend on the promo-ready fixes.

| # | Idea | Size | Needs first |
| :--- | :--- | :--- | :--- |
| 1 | Engine-room hello | XS | Course link |
| 2 | Remix template and `REMIX.md` | S | Online-safety note |
| 3 | Code Gator Drip Pack | M (art is the long pole) | Fixes 1-3 |
| 4 | Student-made items, with credits | M | Fixes 1-3, privacy rules below |

### 1. Engine-room hello (quick win)
- A console greeting from Ivan in `src/main.jsx`: "Ahoy, Navigator! You found the engine room. Every outfit here is just a PNG in a folder."
- An HTML comment in `index.html` for anyone who views the page source.
- A footer line, "Made with code at Compass. See how", linking to Compass Code. The footer at the bottom of the wardrobe panel in `src/App.jsx` reads "Compass High School Navigators" today.

### 2. Remix template and `REMIX.md`
- Mark the repo as a GitHub Template, so a student can make their own copy in one click and publish it at their own github.io address.
- Add `REMIX.md` with three silly one-line remixes. Examples: change the footer text, change the background odds in `handleRandomize`, or change the tab title in `index.html`.
- Remix gotchas `REMIX.md` must cover:
  - `vite.config.js` hard-codes `base: 'ivans-style-swamp'`. A copy with a different name must change that one line, or its images and scripts won't load.
  - CI publishes to a `gh-pages` branch, so the copy's Pages source must be set to deploy from the `gh-pages` branch.
- `REMIX.md` needs an online-safety note before it ships: what to leave off a public site (full names, photos of people, schedules, anything that shows where a student is).

### 3. Code Gator Drip Pack
Style Swamp has a welder, a chef and a golfer, but no coder. Ship a "Navigator Coder" set:

| Item | Folder |
| :--- | :--- |
| `</>` hoodie | `src/assets/body/` |
| Sticker-covered laptop | `src/assets/hand/` |
| Rubber duck (the classic debugging joke) | `src/assets/hand/`, or `accessory/` so it can stack with the laptop |
| Giant headphones | `src/assets/head/` |
| "Computer Lab at 2AM" background | `src/assets/bg/` |
| Squinting "debug face", the second face | `src/assets/face/` |

- Hand items are single-select, so a duck in `hand/` replaces the laptop.
- Wearing the full set pops a tiny speech bubble: `print("ahoy")`.
- After a Snap, show one line: "Fun fact: this app adds an outfit when you drop a PNG in a folder. See how in Compass Code."
- Art follows the README's asset rules: 1080x1080 transparent PNGs, full canvas, not cropped.

### 4. Student-made items, with credits
- Art students draw 1080x1080 PNGs. Course students can write a small script that generates an item, such as a hat drawn in code in school colors.
- Picks each season ship with a "Designed by *first name or nickname*" credit.
- Credits live in `src/assets/credits.json` (file name to credit line). `processAssets` reads it and the item button shows it.
- Optional course side quest, "Your First Pull Request Is a Hat": adding one PNG becomes a real fork, branch and pull request exercise. It runs in a private class repo by default.

**How it promotes coding:** the hoodie puts coding next to welding and culinary in the school's identity, and the art-plus-code path pulls in students who don't see themselves as coders.

---

## 🔒 Privacy for Student Art

This repo is public. Anything merged here can be seen by anyone, and deleting a file later does not remove it from git history. Check every item and credit before it merges.

- **Credits are opt-in.** Use a first name or a chosen nickname only.
- **No real people in art.** No faces, photos or self-portraits of students or staff in items or backgrounds. Item names and art must not name real people.
- **Strip file metadata.** Exported PNGs can carry an author name or other details. Remove them before adding a file.
- **Consent stays outside the repo.** The teacher collects and keeps consent. The repo only stores the credit line.
- **Maintainer copies by default.** Students submit through a private class repo or hand the file to a maintainer, who copies it in. A public pull request from a student's own GitHub account is opt-in only, because it publicly ties that account to the school.
- **Upload Base stays on the device.** The uploaded image is shown from a local blob URL and the snapshot is made in the browser, so nothing is sent anywhere. Add a short note next to the button: "Your picture stays on this device. Please don't upload photos of other people."
- **Keep collecting nothing.** The app sends no player data anywhere today. No analytics get added.
