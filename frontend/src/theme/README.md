# Design Token Standards

This directory contains the central source of truth for all design tokens used across the application. By mapping Figma variables to these modules, we guarantee enterprise-level consistency.

## Tokens
- **colors**: Core palette (Backgrounds, Primary Green, Semantics).
- **spacing**: Base-4 spacing scale (e.g. 4px, 8px, 16px).
- **typography**: Inter font family, font-weights, and sizing.
- **radius**: Border radius values from 0 to full (circular).
- **shadows**: Elevation and glowing states (e.g. MetricCard glow).
- **motion**: Transition easing curves and durations.
- **breakpoints**: Media query breakpoints for responsive layout.
- **zIndex**: Stacking context levels to prevent overlap issues.
- **animations**: Keyframe presets (spin, pulse, fade).

All components must import these tokens rather than hardcoding values.
