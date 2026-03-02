# GitHub Repository Name

**`r3f-industrial-configurator`**

Short, clear, signals React Three Fiber + production intent.

---

# Project A — Spec

## r3f-industrial-configurator

*A production-style 3D Web Configurator built with React Three Fiber*

---

# 1️⃣ Project Vision

Build a high-performance industrial 3D configurator that demonstrates:

* Production R3F architecture
* Real-time material & variant system
* Instancing
* Draco compression pipeline
* Lazy loading
* Measured performance

The vibe should feel like:

* B2B industrial product demo
* Clean UI
* Smooth camera
* Stable 60fps

Not flashy.
Professional.

---

# 2️⃣ Core Feature Set (Must Ship)

## A. Scene Foundation

* React + TypeScript + Vite
* React Three Fiber
* OrbitControls (damped)
* HDR Environment lighting
* Directional key light
* r3f-perf overlay

---

## B. 3D Model Loading

* GLB format
* Preprocessed with Draco compression
* Suspense loading fallback
* Loading progress indicator

Deliverable:

* Model size before/after documented

---

## C. Selection System

User can:

* Click any mesh
* Selected part highlights (emissive or outline)
* Selected mesh name stored in global state

Implementation:

* Raycaster via R3F pointer events
* Traverse scene and clone materials (avoid shared mutation)
* Highlight via emissive or material override

---

## D. Real-Time Color Customization

User can:

* Change color of specific named meshes (e.g. Body, Panel, Cover)

Requirements:

* Only targeted meshes change
* No full scene rerender
* Material mutation efficient
* No memory leaks

State flow:
UI → Zustand store → Scene effect hook → material update

---

## E. Variant Switching

At least 2 variants.

Implementation options:

* Toggle visibility of submeshes
* OR load separate GLBs and swap
* OR group-level show/hide

Requirement:
Variant switch must not trigger heavy GC spike.

---

## F. Instancing Demonstration

Add repeated geometry to prove performance knowledge.

Example:

* 300–1000 bolts
* Or decorative structural elements

Must use:

* `<instancedMesh />`

Document:

* Draw calls before
* Draw calls after

---

## G. Performance Proof

Overlay:

* r3f-perf

Document:

* FPS desktop
* FPS mobile
* Draw calls
* Model memory

---

## H. Lazy Loading

At least one of:

* Dynamically import heavy scene module
* Lazy load environment
* Lazy load variant assets

Demonstrates production mindset.

---

# 3️⃣ Performance Requirements

## Desktop

* Stable near 60fps on normal laptop

## Mobile

* Smooth interaction
* No major stutter

---

# 4️⃣ Asset Pipeline Requirement

You MUST include:

## `/tools/optimize.mjs`

Script that:

* Takes raw GLB
* Applies Draco compression
* Outputs optimized GLB

README must show:

| Stage         | Size |
| ------------- | ---- |
| Raw GLB       | X MB |
| Optimized GLB | Y MB |

Even if simple, this alone signals senior-level thinking.

---

# 5️⃣ Architecture

Recommended structure:

```
r3f-industrial-configurator/
│
├── public/
│   ├── models/
│   └── hdr/
│
├── src/
│   ├── app/
│   │   └── App.tsx
│   │
│   ├── scene/
│   │   ├── SceneRoot.tsx
│   │   ├── Product.tsx
│   │   ├── Selection.ts
│   │   ├── Variants.ts
│   │   └── InstancedDetails.tsx
│   │
│   ├── state/
│   │   └── store.ts
│   │
│   ├── ui/
│   │   ├── ControlPanel.tsx
│   │   └── Loader.tsx
│   │
│   └── utils/
│       └── materialHelpers.ts
│
├── tools/
│   └── optimize.mjs
│
├── README.md
└── package.json
```

---

# 6️⃣ README Structure (Critical)

Your README must include:

## Title

r3f-industrial-configurator

## Live Demo Link

## What This Demonstrates

* Production R3F setup
* Real-time customization
* Instancing
* Asset optimization
* Performance measurement

## Optimization Techniques Used

* Draco compression
* InstancedMesh
* Lazy loading
* Controlled material mutation

## Performance Metrics

Include real numbers.

## Tradeoffs

Be honest and technical.

This reads like a production engineer wrote it.

---

# 7️⃣ Visual Identity (Keep Minimal)

* Dark background
* Clean sidebar
* Neutral typography
* No design overkill

Industrial > flashy

---

# 8️⃣ What Will Impress Them Most

Not shaders.

Not animations.

This sentence:

> “Instancing reduced draw calls from 450 to 8 and stabilized mobile FPS from 28 → 55.”

That wins.

