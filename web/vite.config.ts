import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Same toolchain as the Compliance Engine demo so the two apps stay
// visually and structurally consistent: React 19 + Vite + Tailwind v4.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5174 },
});
