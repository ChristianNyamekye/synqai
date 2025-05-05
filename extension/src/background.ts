/// <reference types="chrome"/>

// Background service worker to handle snippets and extension state
interface Snippet {
  url: string;
  title: string;
  content: string;
  timestamp: number;
}

// Store snippets in chrome.storage
async function storeSnippet(snippet: Snippet): Promise<void> {
  try {
    const { snippets = [] } = await chrome.storage.local.get("snippets");
    snippets.push(snippet);
    await chrome.storage.local.set({ snippets });
  } catch (error) {
    console.error("Error storing snippet:", error);
  }
}

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "pageLoaded") {
    // Handle page load notification
    console.log("Page loaded:", request.url);
  } else if (request.action === "storeSnippet") {
    // Store the received snippet
    storeSnippet(request.snippet);
  }
  return true;
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Initialize storage with empty snippets array
    chrome.storage.local.set({ snippets: [] });
  }
});
