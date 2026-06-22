/// <reference types="vite/client" />

// The world-atlas topojson is large; declare it minimally so tsc doesn't
// infer a giant literal type from the JSON. WorldMap.tsx casts it for use.
declare module "world-atlas/countries-110m.json" {
  const topology: { objects: { countries: unknown } };
  export default topology;
}
