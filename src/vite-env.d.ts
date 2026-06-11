/// <reference types="vite/client" />

// GLB models imported as URLs (see vite.config.ts assetsInclude).
declare module '*.glb' {
  const src: string
  export default src
}
