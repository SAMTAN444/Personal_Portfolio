import { createRoot } from 'react-dom/client'
import './index.css'
import './theme.css'
import App from './App.tsx'

// NOTE: StrictMode is intentionally omitted. It double-mounts every component in
// dev, and @react-three/rapier's physics world (used by the hero Lanyard) does
// not survive that synchronous unmount/remount — the WebGL context is disposed
// and the 3D badge vanishes. StrictMode is a no-op in production, so dropping it
// only changes dev behavior, and keeps the dev experience matching the build.
createRoot(document.getElementById('root')!).render(<App />)
