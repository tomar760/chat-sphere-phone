import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './firebase'

createRoot(document.getElementById("root")!).render(<App />);
