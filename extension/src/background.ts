import { Scope } from "@synqai/shared";

// API client for communicating with the local host
const API_BASE_URL = "http://localhost:42715";

async function requestPermission(
  agentId: string,
  scopes: Scope[]
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/request-permission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agentId, scopes }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Failed to request permission:", error);
    return false;
  }
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "REQUEST_PERMISSION") {
    requestPermission(message.agentId, message.scopes)
      .then((success) => sendResponse({ success }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }
});

// Handle navigation events to capture data
chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId === 0) {
    // Main frame only
    try {
      // Get the current tab
      const tab = await chrome.tabs.get(details.tabId);

      // Store the URL in the memory store
      await fetch(`${API_BASE_URL}/write-memory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-agent-id": "browser-extension",
        },
        body: JSON.stringify({
          scope: "browse-history.read",
          data: {
            url: tab.url,
            title: tab.title,
            timestamp: Date.now(),
          },
        }),
      });
    } catch (error) {
      console.error("Failed to store navigation data:", error);
    }
  }
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    // Sync changes with the local host
    Object.entries(changes).forEach(async ([key, change]) => {
      try {
        await fetch(`${API_BASE_URL}/write-memory`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-agent-id": "browser-extension",
          },
          body: JSON.stringify({
            scope: "storage.read",
            data: {
              key,
              newValue: change.newValue,
              oldValue: change.oldValue,
              timestamp: Date.now(),
            },
          }),
        });
      } catch (error) {
        console.error("Failed to sync storage changes:", error);
      }
    });
  }
});
