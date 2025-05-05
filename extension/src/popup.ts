interface PermissionStatus {
  calendar: boolean;
  travel: boolean;
}

// Initialize popup
document.addEventListener("DOMContentLoaded", async () => {
  const connectBtn = document.getElementById(
    "connect-btn"
  ) as HTMLButtonElement;
  const calendarStatus = document.getElementById(
    "calendar-status"
  ) as HTMLDivElement;
  const travelStatus = document.getElementById(
    "travel-status"
  ) as HTMLDivElement;

  // Load current permission status
  const status = await loadPermissionStatus();
  updateUI(status);

  // Handle connect button click
  connectBtn.addEventListener("click", async () => {
    try {
      // Request calendar permission
      if (!status.calendar) {
        const calendarGranted = await requestCalendarPermission();
        status.calendar = calendarGranted;
      }

      // Request travel sites permission
      if (!status.travel) {
        const travelGranted = await requestTravelPermission();
        status.travel = travelGranted;
      }

      // Save updated status
      await chrome.storage.sync.set({ permissions: status });
      updateUI(status);
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  });
});

// Load permission status from storage
async function loadPermissionStatus(): Promise<PermissionStatus> {
  const result = await chrome.storage.sync.get("permissions");
  return result.permissions || { calendar: false, travel: false };
}

// Request calendar permission
async function requestCalendarPermission(): Promise<boolean> {
  try {
    const result = await chrome.permissions.request({
      origins: ["*://*.google.com/calendar/*"],
    });
    return result;
  } catch (error) {
    console.error("Error requesting calendar permission:", error);
    return false;
  }
}

// Request travel sites permission
async function requestTravelPermission(): Promise<boolean> {
  try {
    const result = await chrome.permissions.request({
      origins: [
        "*://*.booking.com/*",
        "*://*.expedia.com/*",
        "*://*.kayak.com/*",
      ],
    });
    return result;
  } catch (error) {
    console.error("Error requesting travel permission:", error);
    return false;
  }
}

// Update UI based on permission status
function updateUI(status: PermissionStatus) {
  const calendarStatus = document.getElementById(
    "calendar-status"
  ) as HTMLDivElement;
  const travelStatus = document.getElementById(
    "travel-status"
  ) as HTMLDivElement;
  const connectBtn = document.getElementById(
    "connect-btn"
  ) as HTMLButtonElement;

  // Update calendar status
  calendarStatus.textContent = `Google Calendar: ${
    status.calendar ? "Connected" : "Not Connected"
  }`;
  calendarStatus.className = `status ${
    status.calendar ? "active" : "inactive"
  }`;

  // Update travel status
  travelStatus.textContent = `Travel Sites: ${
    status.travel ? "Connected" : "Not Connected"
  }`;
  travelStatus.className = `status ${status.travel ? "active" : "inactive"}`;

  // Update connect button
  connectBtn.textContent =
    status.calendar && status.travel
      ? "All Services Connected"
      : "Connect Services";
  connectBtn.disabled = status.calendar && status.travel;
}
