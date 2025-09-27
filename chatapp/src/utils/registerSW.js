
export const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('SW registered');
    return registration;
  }
};