# Anatomical Jewelry Visualizer - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Schemas](#data-schemas)
3. [Calculation / Logic Algorithms](#calculation--logic-algorithms)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Customization](#customization)
7. [Performance](#performance)
8. [Browser Compatibility](#browser-compatibility)
9. [Security](#security)
10. [Version History](#version-history)
11. [Support and Contact](#support-and-contact)

---

## Architecture Overview

### Technology Stack

- **HTML5** - Semantic markup with canvas elements for rendering
- **CSS3** - Custom properties for theming, responsive design, flexbox/grid layouts
- **Vanilla JavaScript (ES6+)** - No frameworks, no external dependencies
- **Canvas API** - 2D rendering for jewelry visualization and try-on overlay
- **LocalStorage** - Theme persistence and user preferences

### File Structure

```
/tools/jewelry-size-visualizer/
├── index.html                 # Main application entry point
├── diagnostic.html            # Test suite for verifying module loading
├── documentation.html         # User-facing documentation page
├── embed.html                 # Embed widget page with copy-paste codes
├── embed_backup.html          # Legacy embed widget
├── css/
│   ├── style.css              # Main application styles
│   └── poli-standard.css      # Standard Poli branding styles
├── js/
│   ├── database.js            # Jewelry data store and query functions
│   ├── calibration.js         # Screen calibration system
│   ├── visualizer.js          # 1:1 scale rendering engine
│   ├── try-on.js              # Photo upload and overlay module
│   ├── comparison.js          # Side-by-side comparison module
│   ├── anatomy.js             # Body location guide and recommendations
│   ├── styles.js              # Style selector module
│   ├── stretching.js          # Stretching guide calculator
│   ├── main.js                # Application controller and tab management
│   └── feedback.js            # Placeholder for future feedback
└── images/                    # Anatomy diagram SVGs (ear.svg, nose.svg, etc.)
```

### Component / Logic Breakdown

| Module | File | Responsibility |
|--------|------|----------------|
| Database | `database.js` | Jewelry data store, filter, search, and statistics |
| Calibration | `calibration.js` | Screen DPI detection and calibration workflow |
| Visualizer | `visualizer.js` | Canvas rendering at true 1:1 scale |
| Try-On | `try-on.js` | Photo upload, canvas overlay, drag/rotate/scale controls |
| Comparison | `comparison.js` | Multi-item side-by-side comparison with table |
| Anatomy | `anatomy.js` | Body location guide with sizing recommendations |
| Styles | `styles.js` | Jewelry style browsing and filtering |
| Stretching | `stretching.js` | Ear stretching timeline and size progression |
| Main | `main.js` | Tab navigation, app state, event coordination |

---

## Data Schemas

### Jewelry Item Object

Defined in `database.js` as the primary data structure for all jewelry pieces.

```javascript
{
  id: "captive-8mm-16g",           // Unique string identifier
  name: "8mm Ball Closure Ring",   // Display name
  category: "captive",             // One of: rings, labrets, barbells, circular, captive, clickers, plugs
  type: "Ball Closure Ring",       // Human-readable type
  gauge: "16g",                    // Gauge string (20g through 00g)
  gaugeMM: 1.2,                    // Metric equivalent in millimeters
  diameter: 0.3125,                // Internal diameter in inches (for rings)
  diameterMM: 8,                   // Internal diameter in millimeters
  length: null,                    // Post length in inches (for labrets/barbells)
  lengthMM: null,                  // Post length in millimeters
  material: "titanium",           // Material category
  materialDisplay: "Implant-Grade Titanium",  // Human-readable material
  locations: ["ear", "nose"],      // Array of body location strings
  popular: true,                   // Whether item appears in quick-load defaults
  description: "Classic captive bead ring with internal threading",  // Optional
  image: null                      // Optional image URL (not used in current version)
}
```

### Anatomy Data Object

Defined in `anatomy.js` for each body location.

```javascript
{
  ear: {
    name: "Ear Piercings",
    jewelryTypes: ["Labret Studs", "Rings", "Barbells", "Clickers", "Plugs/Tunnels"],
    gauges: ["20g", "18g", "16g", "14g", "12g", "10g", "8g", "6g", "4g", "2g", "0g", "00g"],
    sizes: [
      { type: "Lobe", gauge: "20g-14g", size: '1/4"-3/8" (6-10mm)' },
      { type: "Helix", gauge: "18g-14g", size: '5/16"-3/8" (8-10mm)' },
      // ... more sub-types
    ],
    notes: "Ear piercings are the most versatile..."
  },
  // ... nose, lip, tongue, eyebrow, navel, nipple, surface, male-genital, female-genital
}
```

### Comparison Selection State

Managed in `comparison.js`:

```javascript
{
  slots: [
    null,                    // Slot 1: jewelry object or null
    null,                    // Slot 2: jewelry object or null
    null,                    // Slot 3: jewelry object or null
    null                     // Slot 4: jewelry object or null
  ],
  maxSlots: 4                // Maximum number of comparable items
}
```

### App State Object

Managed in `main.js`:

```javascript
{
  currentTab: "visualizer",       // Active navigation tab
  selectedJewelry: null,          // Currently selected jewelry item
  comparisonItems: [],            // Items added to comparison
  calibrationPPI: 96,             // Pixels per inch after calibration
  theme: "dark",                  // "dark" or "light"
  tryOnPhoto: null,               // Uploaded photo data URL
  tryOnScale: 100,                // Scale percentage for try-on overlay
  tryOnRotation: 0,               // Rotation degrees for try-on overlay
  tryOnOpacity: 100               // Opacity percentage for try-on overlay
}
```

---

## Calculation / Logic Algorithms

### 1. Gauge to Inches Conversion

**File:** `database.js` (or `main.js`)

```javascript
function gaugeToInches(gauge) {
  // Converts gauge string to decimal inches
  // Uses standard AWG (American Wire Gauge) table for body jewelry
  // Example: "16g" -> 0.051 inches
  // Example: "14g" -> 0.064 inches
  // Example: "12g" -> 0.081 inches
}
```

**Logic:** Lookup table mapping gauge strings to decimal inch values. Standard body jewelry gauges from 20g (0.032") to 00g (0.365").

### 2. Screen Calibration

**File:** `calibration.js`

```javascript
function calibrateScreen() {
  // 1. Display a known-size reference card (credit card: 85.6mm x 54mm)
  // 2. User places a physical credit card on screen and adjusts slider
  // 3. Calculate actual PPI: knownMM / displayedPixels * screenDPI
  // 4. Store calibrationPPI in AppState
  // 5. Apply to all subsequent renderings
}
```

**Formula:** `actualPPI = (knownPhysicalSizeMM / displayedSizePixels) * screenLogicalDPI`

### 3. 1:1 Scale Canvas Rendering

**File:** `visualizer.js`

```javascript
function renderJewelry(canvas, jewelry, options) {
  // 1. Clear canvas
  // 2. Calculate pixel dimensions:
  //    diameterPixels = jewelry.diameterMM * (calibrationPPI / 25.4)
  // 3. Draw outer circle (ring) or rectangle (barbell) at calculated size
  // 4. Draw gauge thickness:
  //    thicknessPixels = gaugeMM * (calibrationPPI / 25.4)
  // 5. Add labels and measurement annotations
  // 6. Draw reference ruler at bottom
}
```

**Key Formula:** `pixels = millimeters * (PPI / 25.4)` where 25.4 is mm per inch.

### 4. Size Comparison Generation

**File:** `main.js` (MeasurementStandards object)

```javascript
function generateSizeComparisons(jewelryArea) {
  // 1. Calculate jewelry cross-sectional area:
  //    For rings: area = PI * (diameter/2)^2
  //    For barbells: area = length * gaugeWidth
  // 2. Compare against known standards:
  //    - Credit card: 46.25 cm²
  //    - A5 paper: 310 cm²
  //    - A4 paper: 623 cm²
  //    - A3 paper: 1,245 cm²
  // 3. Return array of { name, size, ratio } objects
}
```

### 5. Try-On Overlay Rendering

**File:** `try-on.js`

```javascript
function renderTryOn(canvas, photo, jewelry, scale, rotation, opacity) {
  // 1. Draw uploaded photo as background
  // 2. Apply scale transformation: canvas.scale(scale/100)
  // 3. Apply rotation: canvas.rotate(rotation * PI / 180)
  // 4. Draw jewelry at calibrated size with globalAlpha = opacity/100
  // 5. Enable drag-to-position via mouse/touch events
}
```

### 6. Jewelry Filtering

**File:** `database.js`

```javascript
function filterJewelry(filters) {
  // filters = { category, gauge, material, location }
  // 1. Start with full jewelry array
  // 2. For each non-"all" filter, apply array.filter()
  // 3. Return filtered array
  // 4. If no filters match, return empty array
}
```

---

## API Reference

### Global Functions (window scope)

#### Database Functions (`database.js`)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getAllJewelry()` | None | `Array<JewelryItem>` | Returns complete jewelry database |
| `getJewelryById(id)` | `id: string` | `JewelryItem \| undefined` | Finds item by unique ID |
| `filterJewelry(filters)` | `filters: object` | `Array<JewelryItem>` | Filters by category, gauge, material, location |
| `searchJewelry(query)` | `query: string` | `Array<JewelryItem>` | Searches by name and description |
| `getPopularJewelry()` | None | `Array<JewelryItem>` | Returns items with `popular: true` |
| `getJewelryByLocation(location)` | `location: string` | `Array<JewelryItem>` | Filters by body location |
| `getDatabaseStats()` | None | `object` | Returns count, category breakdown, gauge range |

#### Scale Renderer (`main.js`)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `gaugeToInches(gauge)` | `gauge: string` | `number` | Converts gauge to decimal inches |
| `renderJewelry(canvas, jewelry, options)` | `canvas: HTMLCanvasElement, jewelry: JewelryItem, options: object` | `void` | Renders jewelry at 1:1 scale |

#### Measurement Standards (`main.js`)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `generateSizeComparisons(area)` | `area: number` | `Array<{name, size, ratio}>` | Generates real-world size comparisons |

#### Anatomy Guide (`anatomy.js`)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `AnatomyGuide.init()` | None | `void` | Binds click handlers to anatomy buttons |
| `AnatomyGuide.showLocation(location)` | `location: string` | `void` | Displays anatomy details for given location |
| `AnatomyGuide.browseJewelry()` | None | `void` | Switches to visualizer tab with location filter |

### Event Handlers

| Event | Element | Handler | Description |
|-------|---------|---------|-------------|
| `click` | `.nav-tab` | `switchTab()` | Switches between main tool tabs |
| `click` | `.tool-tab` | `switchToolTab()` | Switches between Tool/Docs/Embed views |
| `change` | `#filter-category` | `applyFilters()` | Filters jewelry gallery |
| `change` | `#filter-gauge` | `applyFilters()` | Filters jewelry gallery |
| `change` | `#filter-material` | `applyFilters()` | Filters jewelry gallery |
| `change` | `#filter-location` | `applyFilters()` | Filters jewelry gallery |
| `click` | `.anatomy-btn` | `AnatomyGuide.showLocation()` | Shows anatomy details |
| `input` | `#scale-slider` | `updateTryOnScale()` | Adjusts try-on overlay scale |
| `input` | `#rotation-slider` | `updateTryOnRotation()` | Adjusts try-on overlay rotation |
| `input` | `#opacity-slider` | `updateTryOnOpacity()` | Adjusts try-on overlay opacity |
| `change` | `#photo-upload` | `handlePhotoUpload()` | Loads user photo for try-on |
| `click` | `#calibrate-button` | `startCalibration()` | Initiates screen calibration |
| `click` | `#save-try-on` | `saveTryOnResult()` | Downloads try-on canvas as image |
| `click` | `#share-try-on` | `shareTryOn()` | Shares try-on result (Web Share API) |

---

## Integration Guide

### Standalone Embedding via iframe

The tool is dependency-free static HTML/CSS/JS. No build tools, no API keys, no server-side requirements.

#### Basic Embed

```html
<iframe
  src="https://poliinternational.com/tools/jewelry-size-visualizer/index.html"
  width="100%"
  height="800"
  frameborder="0"
  style="border: 1px solid #ddd; border-radius: 8px;"
  title="Jewelry Size Visualizer by Poli International">
</iframe>
```

#### Available Embed Sizes

| Version | Height | Use Case |
|---------|--------|----------|
| Standard | 800px | Recommended for most sites |
| Large | 1000px | Dedicated tool pages |
| Compact | 600px | Space-constrained layouts |

#### Dark Mode Support

The iframe automatically detects if it is embedded and listens for `postMessage` events:

```javascript
// Parent page can control theme
iframe.contentWindow.postMessage({
  type: 'poli-theme',
  light: true   // true for light mode, false for dark mode
}, '*');
```

#### Embed Code Page

A dedicated embed page at `/tools/jewelry-size-visualizer/embed.html` provides:
- Copy-paste iframe codes for all three sizes
- Live preview of the embedded tool
- Customization examples (border, shadow)
- Implementation notes and browser support

### Direct URL Access

The tool is fully functional when accessed directly:
`https://poliinternational.com/tools/jewelry-size-visualizer/`

---

## Customization

### CSS Custom Properties

The tool uses CSS custom properties for theming. Override these in your parent page if embedding:

```css
:root {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --text-primary: #F1F5F9;
  --text-secondary: #E2E8F0;
  --color-rose-gold: #B76E79;
  --color-sky-blue: #0EA5E9;
}
```

### iframe Styling

Modify the iframe `style` attribute for visual integration:

```html
<iframe
  src="https://poliinternational.com/tools/jewelry-size-visualizer/index.html"
  width="100%"
  height="800"
  frameborder="0"
  style="border: 2px solid #B76E79; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
  title="Jewelry Size Visualizer by Poli International">
</iframe>
```

### No JavaScript API for External Control

The tool does not expose a public JavaScript API for external manipulation. All customization is visual via CSS overrides on the iframe container.

---

## Performance

### Asset Loading

- **Total JavaScript:** ~80KB across 9 modules (minified)
- **CSS:** ~15KB across 2 stylesheets
- **Images:** Anatomy SVGs loaded on demand (lazy loading)
- **No external fonts** - uses system font stack as fallback

### Rendering Optimization

- Canvas rendering is requestAnimationFrame-based for smooth 60fps
- Jewelry gallery uses DOM recycling (only visible items rendered)
- Try-on overlay renders only when user adjusts controls
- Comparison canvas re-renders only on item add/remove

### Memory Management

- Uploaded photos are stored as data URLs (max 10MB)
- Canvas contexts are cleared before re-render
- No persistent WebSocket connections
- No service workers or cache storage

---

## Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| iOS Safari | 14+ | Touch events supported |
| Android Chrome | 90+ | Touch events supported |

### Requirements

- **JavaScript enabled** - Tool is non-functional without JS
- **HTML5 Canvas** - Required for all visualization features
- **LocalStorage** - Required for theme persistence
- **Camera/File API** - Required for Virtual Try-On (user permission needed)

### Known Limitations

- Screen calibration requires a physical reference card for maximum accuracy
- Virtual Try-On requires user photo upload (no live camera mode)
- Comparison limited to 4 items simultaneously
- No 3D rendering - all visualizations are 2D

---

## Security

### Input Handling

- All user inputs are sanitized before display:
  - File uploads restricted to `image/*` MIME types
  - Canvas rendering uses only pre-defined jewelry data
  - No user text input fields exist in the tool
- No SQL/NoSQL injection vectors (no database queries)
- No server-side processing (static client-side only)

### XSS Prevention

- All jewelry names and descriptions are hardcoded in `database.js`
- No `innerHTML` with user-supplied content
- Canvas API used for all dynamic rendering (no DOM injection)
- iframe embeds are sandboxed by browser security model

### Data Privacy

- No cookies set by the tool
- No analytics or tracking scripts
- No external API calls
- Photo uploads remain client-side only (never transmitted)
- LocalStorage used only for theme preference

### Content Security Policy

The tool does not set CSP headers. When embedding, consider adding:

```html
<iframe
  sandbox="allow-scripts allow-same-origin allow-forms"
  ...
></iframe>
```

Note: `allow-scripts` is required for tool functionality. `allow-same-origin` is needed for LocalStorage.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-07 | Initial release |

### Changelog (1.0.0)

- Interactive jewelry visualizer with 1:1 scale rendering
- Virtual Try-On with photo upload and overlay controls
- Size comparison tool (up to 4 items)
- Body location anatomy guide with 10 body areas
- Style selector with category/gauge/material/location filters
- Stretching guide with safe progression timeline
- Screen calibration system for accurate sizing
- Dark/light mode with persistent preference
- Responsive design for mobile and desktop
- Embeddable via iframe with three size options
- Diagnostic test suite for module verification

---

## Support and Contact

For technical support, integration assistance, or bug reports:

- **Email:** support@poliinternational.com
- **Website:** https://poliinternational.com
- **Documentation:** https://poliinternational.com/jewelry-size-visualizer-documentation/
- **Tool URL:** https://poliinternational.com/tools/jewelry-size-visualizer/

### Support Inquiries

When contacting support, please include:
1. Browser name and version
2. Device type (desktop, tablet, mobile)
3. Screen resolution and DPI
4. Steps to reproduce any issue
5. Screenshots or screen recordings if applicable

### Contributing

This tool is open source under the MIT License. The code repository is available at:
https://github.com/poli-international/jewelry-size-visualizer

---

*Documentation generated from source code version 1.0.0. For the most current information, always refer to the live tool at the URL above.*
