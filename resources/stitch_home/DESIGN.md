# Pixel Quest Design System

### 1. Overview & Creative North Star
**Creative North Star: "The Retro RPG HUD"**

Pixel Quest is a high-fidelity interpretation of classic 8-bit and 16-bit video game interfaces. It moves away from the "floating card" aesthetic of modern SaaS and instead embraces a tactile, mechanical feel. The system is defined by its hard edges, high-contrast bevels, and a primary-color-driven palette that emphasizes gamified progress and heroic achievement. It rejects the standard fluid grid in favor of a "Chunky Grid" that feels like it was rendered on a CRT monitor, using intentional pixel-aligned spacing and heavy borders to define space.

### 2. Colors
The palette is a mix of tactical grays and vibrant quest-oriented colors.

- **Primary Role (#3c43e4):** Used for heroic progression, XP bars, and key interactive titles.
- **Tertiary Role (#7db23e):** Specifically reserved for "Success" states and completion marks, mirroring classic "Grass" tiles.
- **Surface Hierarchy:** 
  - **The "No-Line" Rule:** While boundaries are strong, they are not simple 1px lines. Avoid modern hairlines. Instead, use the **Bevel System**: a combination of dark shadows (#373737) and highlight edges (#FFFFFF) to create an extruded 3D effect.
  - **Nesting:** Use `surface_container` for the main canvas and `surface_container_highest` for recessed areas like empty progress tracks or inner wells.

### 3. Typography
The system uses a jarring but intentional scale that mixes ultra-condensed labels with bold, shadowed headlines.

**Typography Scale (Ground Truth):**
- **Display/Hero:** 20px (1.25rem) to 30px (1.875rem) with `text-shadow: 2px 2px #3f3f3f`.
- **Headlines:** 14px (0.875rem) to 18px (1.125rem) for section titles.
- **Body:** 12px (0.75rem) using `Be Vietnam Pro` for readability in long-form quest descriptions.
- **Micro-Labels:** 6px to 10px. These are exclusively for HUD data (XP, Level, Navigation labels) and must be set in uppercase or pixel-font styles.

The juxtaposition of the geometric `Space Grotesk` (or `Press Start 2P` in source) for headers and the utilitarian `Be Vietnam Pro` for body creates a "Digital Manual" feel.

### 4. Elevation & Depth
Elevation in Pixel Quest is achieved through **Tactile Extrusion** rather than light-source shadows.

- **The Layering Principle:** Depth is simulated via the `mc-container` style.
- **Bevel Values (Ground Truth):**
  - **Raised (Buttons/Cards):** `inset -4px -4px 0 0 #555, inset 4px 4px 0 0 #fff`. This creates a physical "pop" off the screen.
  - **Pressed:** `inset 4px 4px 0 0 #555`. This simulates the physical depression of a plastic button.
  - **Recessed (Progress Bars):** `inset 4px 4px 0 0 #000`. Creates a "well" inside a container.
- **Ghost Border Fallback:** Use a solid 4px border in `#373737` for primary structural elements.

### 5. Components
- **Buttons:** Must use the 4px bevel. Interactive states are strictly binary—either raised or depressed—mimicking hardware.
- **Progress Bars:** High-contrast "filling" behavior. The container is a recessed black well, and the fill is a solid, un-gradiented block of Primary or Tertiary color.
- **Cards (Containers):** Always feature a 4px `outline` and the dual-tone bevel. Backgrounds are strictly opaque `#c6c6c6`.
- **Chips:** Styled as "Badges," often with gold text-shadows (#ffcc00) for currency or rare items.

### 6. Do's and Don'ts
- **Do:** Use pixelated image rendering (`image-rendering: pixelated`) for all icons and avatars.
- **Do:** Use "chunky" spacing increments of 4px or 8px exclusively.
- **Don't:** Use border-radius. Every corner must be a sharp 90-degree angle (Roundedness: 0).
- **Don't:** Use soft, multi-layered "ambient" shadows. Every shadow must be a hard, solid-color block.
- **Do:** Ensure text contrast against the sky-blue (#87ceeb) background by containing it within UI blocks.