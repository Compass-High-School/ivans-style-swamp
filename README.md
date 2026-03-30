# 🐊 Ivan's Style Swamp

**The Official Compass High School Mascot Customizer**

Welcome to the swamp! **Ivan's Style Swamp** is an interactive dress-up game for Ivan the Gator, the mascot of Compass High School. This application allows users to customize Ivan with various outfits, accessories, and backgrounds, then save their creations.

[**🚀 Play the Live Game Here**](https://compass-high-school.github.io/ivans-style-swamp/)

---

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7](https://vitejs.dev/) (utilizing `import.meta.glob` for dynamic asset loading)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** GitHub Pages

---

## 📂 Project Structure

```text
├── public/              # Static assets (favicon, etc.)
├── src/
│   ├── assets/          # Layered PNG assets organized by category
│   │   ├── base/        # The base character (Ivan)
│   │   ├── face/        # Expressions (Happy, Cool, etc.)
│   │   ├── legs/        # Pants and lower body items
│   │   ├── body/        # Shirts and upper body items
│   │   ├── accessory/   # Extra items (Glasses, necklaces, etc.)
│   │   ├── head/        # Hats and headwear
│   │   ├── hand/        # Handheld items
│   │   └── bg/          # Background images
│   ├── App.jsx          # Main application logic and UI
│   ├── App.css          # App-specific styles
│   ├── index.css        # Global Tailwind styles
│   └── main.jsx         # Entry point
├── tailwind.config.js   # Tailwind configuration
└── vite.config.js       # Vite configuration
```

---

## ⚙️ How It Works

### 1. Dynamic Asset Loading
The app uses Vite's `import.meta.glob` to automatically discover and load images from the `src/assets/` subdirectories. This means adding a new item is as simple as dropping a file into the correct folder.

```javascript
const rawBody = import.meta.glob('./assets/body/*.{png,jpg,jpeg,webp}', { eager: true });
```

The `processAssets` helper function cleans up filenames (removing numbers and underscores) to create user-friendly labels in the UI.

### 2. The Layering Engine (`IvanRenderer`)
Ivan is rendered by stacking transparent PNGs on top of each other. The order of rendering in the `IvanRenderer` component determines the "Z-index" of the clothes. The current order is:
1. **Base** (Ivan himself)
2. **Face** (Expressions)
3. **Legs** (Pants)
4. **Body** (Shirts)
5. **Accessories** (Multi-layered)
6. **Head** (Hats)
7. **Hand** (Handhelds)

### 3. State Management
The `outfit` state object tracks which asset is currently selected for each category.
- **Single-select:** Categories like `body` or `head` only allow one item at a time.
- **Multi-select:** The `accessory` category allows multiple items to be equipped simultaneously.
- **Mandatory:** The `face` category always has an item equipped (it defaults to "Cool" and cannot be unequipped, only swapped).

---

## 🎨 Adding New Content

### Asset Requirements
To ensure items line up perfectly, designers must follow these "Paper Doll" rules:
- **Dimensions:** 1080x1080 pixels (Square).
- **Format:** Transparent PNG (or WebP).
- **Positioning:** Draw the item in its correct position relative to Ivan's body. **Do not crop the image to the item**; export the full 1080x1080 canvas with transparency.

### Adding a New Item
1. Place your PNG in the appropriate folder under `src/assets/` (e.g., `src/assets/head/`).
2. The app will automatically detect it and create a button in the UI using the filename (e.g., `party_hat.png` becomes "Party Hat").

### Adding a New Category
To add a new layer (e.g., "Shoes"):
1. Create a folder: `src/assets/shoes/`.
2. Update `App.jsx`:
   - Add a new `import.meta.glob` for `rawShoes`.
   - Add `shoes` to the `ASSETS` object.
   - Add a `SHOES` entry to the `CATEGORIES` constant.
   - Add `shoes: null` to the `outfit` state in `IvanCustomizer`.
   - Update the `IvanRenderer` component to include the new layer:
     ```jsx
     {outfit.shoes && <img src={outfit.shoes} className="..." />}
     ```

---

## 🛠 Development

### 1. Installation
```bash
npm install
```

### 2. Local Development
```bash
npm run dev
```

### 3. Linting
```bash
npm run lint
```

### 4. Build & Deployment
To build the project:
```bash
npm run build
```

The project is configured to deploy to GitHub Pages via the `gh-pages` package:
```bash
npm run deploy
```
*Note: Ensure `vite.config.js` has the correct `base` property set to your repository name (currently set to `ivans-style-swamp`).*

---

## 💚 Compass High School
*Go Navigators!*
