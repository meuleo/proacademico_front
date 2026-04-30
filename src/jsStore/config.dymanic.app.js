// Verificar se esta no dektop
function isElectron() {
  return typeof window !== 'undefined' && 
         typeof window.process === 'object' && 
         window.process.type === 'renderer';
}

// Uso
if (isElectron()) {
  console.log("Executando no app desktop (Electron)");
} else {
  console.log("Executando no navegador");
}

// Ou ainda
function isDesktopApp() {
  return (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    window.process.type === 'renderer'
  ) || (navigator.userAgent.toLowerCase().includes("electron"));
}

// Verificar se esta online
function isOnline() {
  return navigator.onLine;
}

// Uso:
if (isOnline()) {
  console.log("✅ Está conectado à internet.");
} else {
  console.log("❌ Está offline.");
}
