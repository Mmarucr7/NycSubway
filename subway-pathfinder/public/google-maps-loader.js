// This script is a fallback for loading Google Maps API directly
// It's added to ensure the callback function works properly
function initMap() {
  // This is intentionally empty as the actual initialization happens in the React component
  console.log("Google Maps API loaded successfully");
  
  // Dispatch an event that our React app can listen for
  window.dispatchEvent(new Event('google-maps-loaded'));
} 