// Generate OG image as PNG and favicon using canvas
// We'll use Next.js built-in OG image generation instead (via app/opengraph-image.tsx)
// For favicon, we'll use the SVG directly and also generate an ICO-compatible PNG

import { readFileSync, writeFileSync } from 'fs';

// Create a simple 32x32 favicon as a minimal ICO file
// We'll use the SVG favicon directly in the layout (modern browsers support it)
console.log('Assets ready - using SVG favicon and Next.js OG image generation');
