// Permission handling for the extension
export async function requestPermissions(): Promise<boolean> {
  try {
    const result = await chrome.permissions.request({
      permissions: [
        "storage",
        "tabs",
        "webNavigation",
        "scripting",
        "activeTab",
      ],
      origins: [
        "http://localhost:42715/*",
        "*://*.google.com/calendar/*",
        "*://*.booking.com/*",
        "*://*.expedia.com/*",
        "*://*.kayak.com/*",
      ],
    });
    return result;
  } catch (error) {
    console.error("Error requesting permissions:", error);
    return false;
  }
}

export async function checkPermissions(): Promise<boolean> {
  try {
    const result = await chrome.permissions.contains({
      permissions: [
        "storage",
        "tabs",
        "webNavigation",
        "scripting",
        "activeTab",
      ],
      origins: [
        "http://localhost:42715/*",
        "*://*.google.com/calendar/*",
        "*://*.booking.com/*",
        "*://*.expedia.com/*",
        "*://*.kayak.com/*",
      ],
    });
    return result;
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}
