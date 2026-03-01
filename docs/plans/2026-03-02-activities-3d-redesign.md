# Activities Page 3D Immersive Redesign

## Goal
Transform the activities page from a simple card layout to an immersive 3D experience with collision physics, glassmorphism cards, and premium visual effects.

## Technical Decisions
- **3D Engine**: Three.js via React Three Fiber + Drei + Rapier physics
- **Character Representation**: Glowing geometric shapes with lucide icons
- **Page Style**: Full immersive — 3D hero, glass cards, glowing CTAs

## Architecture

### New Dependencies
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Useful Three.js helpers
- `@react-three/rapier` — 3D physics engine

### New Files
- `src/components/activities/hero-3d-scene.tsx` — 3D scene with 8 colliding geometries
- `src/components/activities/floating-geometry.tsx` — Single glowing geometry component
- `src/components/activities/tilt-card.tsx` — Mouse-tracked 3D tilt card

### Modified Files
- `src/app/[locale]/activities/page.tsx` — Full page rewrite with 3D + glassmorphism

## Sections

### 1. Hero — 3D Collision Scene
- 8 glowing geometries (Icosahedron, Dodecahedron, etc.) per role
- Rapier physics for realistic collision and bouncing
- Particle field background (hundreds of small floating particles)
- Mouse parallax interaction
- Hover tooltips showing role names
- Title/stats/CTA overlay with glassmorphism backdrop

### 2. Steps — Glass Cards
- Glassmorphism cards with backdrop-blur
- Gradient glowing step numbers
- Hover 3D tilt via CSS perspective + framer-motion
- Gradient dashed connecting lines

### 3. Cases — Glowing Hover Cards
- Role-colored glowing borders (animated box-shadow)
- Mouse-position-driven 3D tilt on hover
- Animated gradient flow on top bar
- Subtle role-colored light orbs floating in background

### 4. CTA — Glow Buttons
- Breathing glow pulse on primary button
- Radial gradient halo animation in background
- Hover glow expansion

### Performance
- React.lazy + Suspense for 3D scene
- Reduced geometry count on mobile
- useReducedMotion support
