// Content script for SynqAi
console.log('SynqAi content script loaded');

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);
  // Add your content script logic here
}); 