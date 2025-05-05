interface APISettings {
  url: string;
  key: string;
}

interface DataPreferences {
  collectCalendar: boolean;
  collectTravel: boolean;
}

// Initialize options page
document.addEventListener("DOMContentLoaded", async () => {
  // Load saved settings
  const apiSettings = await loadAPISettings();
  const preferences = await loadPreferences();

  // Set initial values
  const apiUrlInput = document.getElementById("api-url") as HTMLInputElement;
  const apiKeyInput = document.getElementById("api-key") as HTMLInputElement;
  const collectCalendarCheckbox = document.getElementById(
    "collect-calendar"
  ) as HTMLInputElement;
  const collectTravelCheckbox = document.getElementById(
    "collect-travel"
  ) as HTMLInputElement;

  apiUrlInput.value = apiSettings.url;
  apiKeyInput.value = apiSettings.key;
  collectCalendarCheckbox.checked = preferences.collectCalendar;
  collectTravelCheckbox.checked = preferences.collectTravel;

  // Handle API settings save
  const saveApiButton = document.getElementById(
    "save-api"
  ) as HTMLButtonElement;
  saveApiButton.addEventListener("click", async () => {
    const newSettings: APISettings = {
      url: apiUrlInput.value,
      key: apiKeyInput.value,
    };

    await saveAPISettings(newSettings);
    showStatus("api-status", "API settings saved successfully!");
  });

  // Handle preferences save
  const savePreferencesButton = document.getElementById(
    "save-preferences"
  ) as HTMLButtonElement;
  savePreferencesButton.addEventListener("click", async () => {
    const newPreferences: DataPreferences = {
      collectCalendar: collectCalendarCheckbox.checked,
      collectTravel: collectTravelCheckbox.checked,
    };

    await savePreferences(newPreferences);
    showStatus("preferences-status", "Preferences saved successfully!");
  });
});

// Load API settings from storage
async function loadAPISettings(): Promise<APISettings> {
  const result = await chrome.storage.sync.get("apiSettings");
  return result.apiSettings || { url: "", key: "" };
}

// Save API settings to storage
async function saveAPISettings(settings: APISettings): Promise<void> {
  await chrome.storage.sync.set({ apiSettings: settings });
}

// Load preferences from storage
async function loadPreferences(): Promise<DataPreferences> {
  const result = await chrome.storage.sync.get("preferences");
  return result.preferences || { collectCalendar: false, collectTravel: false };
}

// Save preferences to storage
async function savePreferences(preferences: DataPreferences): Promise<void> {
  await chrome.storage.sync.set({ preferences });
}

// Show status message
function showStatus(elementId: string, message: string): void {
  const statusElement = document.getElementById(elementId) as HTMLDivElement;
  statusElement.textContent = message;
  statusElement.className = "status success";
  statusElement.style.display = "block";

  // Hide status after 3 seconds
  setTimeout(() => {
    statusElement.style.display = "none";
  }, 3000);
}
