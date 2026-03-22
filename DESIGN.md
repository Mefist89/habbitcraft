# Design System Strategy: The Dreamscape Framework

## 1. Overview & Creative North Star
**Creative North Star: "The Guided Nebula"**
This design system moves away from the rigid, clinical aesthetic of traditional health trackers to create a "Guided Nebula"—a space that feels expansive, magical, and soft, yet structured enough to provide a sense of security for users aged 8–14. 

We break the "standard app" template by utilizing **intentional asymmetry** and **tonal depth**. Instead of a centered, static grid, elements should feel like they are floating in a gravity-defying environment. Large headline typography creates an editorial "hero" feel, while overlapping containers and expressive emojis provide a tactile, scrapbook-like energy that encourages exploration rather than chore-like data entry.

---

## 2. Colors & Surface Philosophy
The palette utilizes a sophisticated light-theme approach where vibrancy is balanced by airy, breathable neutrals.

### The "No-Line" Rule
**Borders are forbidden for sectioning.** To define boundaries between content blocks, use background color shifts. For example, a `surface-container-low` card should sit directly on a `surface` background. The change in tone is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the following tokens to create "stacked" depth:
*   **Base Layer:** `surface` (#f5f6f7) - The canvas.
*   **Secondary Sections:** `surface-container-low` (#eff1f2) - For grouped content.
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) - To create a "pop-out" effect against the slightly greyish background.

### The "Glass & Gradient" Rule
To elevate the experience, use **Glassmorphism** for floating navigation bars or modal headers. Apply `surface-container-lowest` at 70% opacity with a `backdrop-filter: blur(20px)`. 
*   **Signature Textures:** Use a subtle linear gradient (Top-Left to Bottom-Right) from `primary` (#5860fe) to `primary-container` (#8688ff) for "Goal Reached" states or primary Call-to-Actions to add "soul" to the UI.

---

## 3. Typography
We use a dual-font pairing to balance playfulness with high-end legibility.

*   **Display & Headlines (Plus Jakarta Sans):** This typeface provides a modern, geometric structure that feels "grown-up" but friendly. Use `display-lg` for morning wake-up greetings and `headline-md` for section titles.
*   **Titles & Body (Be Vietnam Pro):** A highly legible sans-serif that maintains a clean, editorial look. Use `title-lg` for card headings and `body-md` for tracking details.
*   **Hierarchy Note:** Always lead with high contrast. A `display-sm` headline should often be paired with a much smaller `label-md` to create a sophisticated, rhythmic layout.

---

## 4. Elevation & Depth
In this system, depth is a feeling, not a drop-shadow.

*   **Tonal Layering:** Achieve 90% of your hierarchy by stacking `surface-container` tiers. A `surface-container-highest` button on a `surface-container-low` background provides enough contrast to be "raised" without a shadow.
*   **Ambient Shadows:** When a floating element (like a FAB or an active sleep card) requires a shadow, use a diffuse, tinted shadow: `box-shadow: 0 20px 40px rgba(88, 96, 254, 0.08)`. Never use pure black or grey for shadows.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline-variant` (#abadae) at **15% opacity**. It should be felt, not seen.
*   **Corner Philosophy:** All main containers must use `ROUND_SIXTEEN` (1rem). For hero elements or "Start Sleep" buttons, push to `lg` (2rem) or `full` to emphasize the friendly, "squishy" nature of the brand.

---

## 5. Components

### Buttons
*   **Primary:** Uses the Primary-to-Primary-Container gradient. Corner radius: `full`. No border.
*   **Secondary:** `secondary-container` (#ded8ff) background with `on-secondary-container` text. Perfect for "Add Note" or "Edit Plan."
*   **Tertiary:** Ghost style. No background, just `title-sm` text with a lead emoji.

### Cards & Lists
*   **No Dividers:** Forbid the use of 1px lines. Use `spacing.6` (2rem) of vertical white space or a shift from `surface-container-low` to `surface-container-highest` to separate list items.
*   **Emoji Integration:** Every card must lead with a high-resolution emoji (e.g., 🌙, ☁️, ⚡) instead of a standard vector icon. The emoji should be placed in a `surface-container-highest` circle.

### Input Fields
*   **The "Soft Input":** Fields should not have a bottom line or 4-sided border. Use a `surface-container-high` background with a `md` (1.5rem) corner radius. Focus states are indicated by a 2px `primary-fixed` "Ghost Border."

### Sleep Progress Tracker (Custom Component)
*   **The "Cloud Slider":** Use a thick track (`1rem` height) using `surface-container-highest`. The thumb/indicator should be a large, glowing circle using `tertiary-fixed` (#eeacdc) to represent "Quality Sleep."

---

## 6. Do’s and Don’ts

### Do
*   **Do** use intentional asymmetry. Place a "Sleep Tip" card slightly offset from the main grid to create a playful, scrapbook feel.
*   **Do** use emojis as functional anchors. A 😴 emoji should be larger and more prominent than the word "Sleep."
*   **Do** utilize the spacing scale religiously. Use `spacing.10` (3.5rem) for top-level padding to give the "Nebula" room to breathe.

### Don’t
*   **Don't** use 1px solid borders. They make the app feel like a spreadsheet.
*   **Don't** use pure black (#000000) for text. Use `on-surface` (#2c2f30) to keep the vibe soft and approachable.
*   **Don't** cram content. If a screen feels full, move content into a horizontal-scroll "carousel" using the `surface-container-low` background.