# Labyrinth

> **Labyrinth hackathon Organised by GDG NIT Hamirpur**  
> *Author: Prashant*

An interactive 3D website and virtual island experience for **Labyrinth**, a premier 36-hour in-person hackathon hosted at the National Institute of Technology (NIT), Hamirpur.

Built with Three.js and native ES modules, running completely in modern browsers with **zero build step**.

---

## ✨ Features

- **🎮 Immersive 3D Voxel World**: Explore the floating hackathon island freely with authentic Minecraft-style voxel graphics, custom lighting bakes, and dynamic day/night atmospheric transitions.
- **🏛️ Interactive Stations & Monuments**:
  - **Central GDG Monument**: Handcrafted double-sided banner with the official Google Developer Groups `< >` emblem and NIT Hamirpur insignia.
  - **Welcome & Info (`x: 0, z: 12`)**: Hackathon introduction, key statistics, and mission statement.
  - **Challenge Tracks (`x: -16, z: 0`)**: AI & Intelligent Systems, Web3 & Decentralized Apps, 3D Web & Creative Tooling, Open Innovation.
  - **Event Schedule (`x: 16, z: 0`)**: Complete 36-hour milestone timeline and mentoring checkpoints.
  - **Prizes & Swag (`x: 0, z: -10`)**: ₹1,50,000+ total prize pool, category plaques, hardware perks, and sponsor bounty tracks.
  - **Sponsors & Partners (`x: 0, z: -18`)**: Platform sponsors, developer tooling grants, and cloud credits.
  - **Team & Mentors (`x: -14, z: -14`)**: Organizing committee, core student leads, and industry mentors.
  - **FAQ (`x: -20, z: -2`)**: Eligibility, team size (2–4 hackers), logistics, and hardware rules.
  - **Venue & Logistics (`x: -15, z: 8`)**: NIT Hamirpur campus venue details, high-speed Wi-Fi, lab equipment, and meals.
  - **Registration (`x: 8, z: 22`)**: Team registration portal and participant application form.
- **📜 Minecraft GUI Content Drawers**: High-contrast, beveled stone dialog panels ensuring readability for all cards, schedules, and prize tiers.
- **🕹️ Movement & Flight Dynamics**:
  - `W`, `A`, `S`, `D` / Arrow keys: Walk and navigate.
  - `Space`: Jump / double-tap to toggle flight mode.
  - `Shift` / `Ctrl`: Sprint on foot or descend while flying.
  - `F`: Interact with nearby stations.
  - `M`: Toggle radar minimap.
- **⚡ Strict Performance Budget**:
  - Rendered in just **15 draw calls** (budget < 60).
  - Less than **10,000 triangles** (budget < 200,000).
  - 100% baked ambient lighting with zero unneeded real-time shadow overhead.
  - Mobile-ready touch controls and responsive layouts.

---

## 🚀 Quick Start

Run locally with any standard Python HTTP server:

```sh
# On Windows / macOS / Linux
python tools/serve.py
```

The script automatically selects an available port, disables browser caching for instant reloading, and opens your browser at `http://127.0.0.1:<port>/`.

### Conformance Checks

```sh
npm run check:site
```

Validates site metadata, configuration, assets, and engine diffs.

---

## 📂 Project Structure

```
index.html          # Station cards, HUD, and 3D world mounting point
homecraft.json      # Metadata: site name, author, tagline, and language
home.config.js      # Configuration: skin, IST timezone (Asia/Kolkata), Dock items
world/
  layout.js         # Island dimensions, spawn point, and station coordinates
  build.js          # World generation, boundary colliders, and setup loops
  structures.js     # 3D architectural models for all hackathon stations & GDG banner
assets/             # Textures, skins, and branding assets
engine/             # Three.js rendering engine and UI systems
tools/              # Local server, validation, and testing scripts
```

---

## 👥 Credits & Organization

- **Organized by**: Google Developer Groups (GDG) on Campus, NIT Hamirpur
- **Author**: Prashant
- **License**: MIT
