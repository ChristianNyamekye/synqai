// Content script for extracting snippets from web pages
interface Snippet {
  url: string;
  title: string;
  content: string;
  timestamp: number;
}

function extractPageContent(): Snippet {
  const url = window.location.href;
  const title = document.title;
  const content = document.body.innerText;

  return {
    url,
    title,
    content,
    timestamp: Date.now(),
  };
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractSnippet") {
    const snippet = extractPageContent();
    sendResponse(snippet);
  }
  return true;
});

// Notify the background script when the page is loaded
chrome.runtime.sendMessage({
  action: "pageLoaded",
  url: window.location.href,
});
