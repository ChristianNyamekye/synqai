import { Scope } from "@synqai/shared";

// Function to request permission from the user
async function requestPermission(
  agentId: string,
  scopes: Scope[]
): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type: "REQUEST_PERMISSION", agentId, scopes },
      (response) => {
        resolve(response.success);
      }
    );
  });
}

// Function to read data from the page
function readPageData(): any {
  const data: any = {
    title: document.title,
    url: window.location.href,
    timestamp: Date.now(),
  };

  // Read meta tags
  const metaTags = document.getElementsByTagName("meta");
  for (let i = 0; i < metaTags.length; i++) {
    const meta = metaTags[i];
    const name = meta.getAttribute("name") || meta.getAttribute("property");
    const content = meta.getAttribute("content");
    if (name && content) {
      data[`meta_${name}`] = content;
    }
  }

  // Read structured data
  const structuredData = document.querySelector(
    'script[type="application/ld+json"]'
  );
  if (structuredData) {
    try {
      data.structuredData = JSON.parse(structuredData.textContent || "{}");
    } catch (error) {
      console.error("Failed to parse structured data:", error);
    }
  }

  return data;
}

// Function to store data in the memory store
async function storeData(scope: Scope, data: any): Promise<void> {
  try {
    const response = await fetch("http://localhost:42715/write-memory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-agent-id": "browser-extension",
      },
      body: JSON.stringify({ scope, data }),
    });

    if (!response.ok) {
      throw new Error(`Failed to store data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to store data:", error);
  }
}

// Main content script logic
async function main() {
  // Read page data
  const pageData = readPageData();

  // Store the data
  await storeData("browse-history.read", pageData);

  // Listen for messages from the page
  window.addEventListener("message", async (event) => {
    if (event.source !== window) return;

    const message = event.data;
    if (message.type === "SYNQAI_REQUEST") {
      const { agentId, scopes } = message;

      // Request permission
      const granted = await requestPermission(agentId, scopes);
      if (granted) {
        // Send the data back to the page
        window.postMessage(
          {
            type: "SYNQAI_RESPONSE",
            success: true,
            data: pageData,
          },
          "*"
        );
      } else {
        window.postMessage(
          {
            type: "SYNQAI_RESPONSE",
            success: false,
            error: "Permission denied",
          },
          "*"
        );
      }
    }
  });
}

// Start the content script
main().catch(console.error);
