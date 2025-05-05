// Background script for SynqAi
console.log('SynqAi background script loaded');

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background script:', message);
  // Add your background script logic here
}); 