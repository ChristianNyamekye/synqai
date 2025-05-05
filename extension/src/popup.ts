// Constants
const VAULT_API_URL = 'http://localhost:42715';
const CHECK_INTERVAL = 5000; // 5 seconds

// DOM Elements
const statusElement = document.getElementById('status') as HTMLDivElement;
const runScoutButton = document.getElementById('runScout') as HTMLButtonElement;
const manageMemoryButton = document.getElementById('manageMemory') as HTMLButtonElement;
const optionsButton = document.getElementById('options') as HTMLButtonElement;

// Check vault connection status
async function checkVaultConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${VAULT_API_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Update UI based on connection status
async function updateConnectionStatus() {
  const isConnected = await checkVaultConnection();
  
  if (isConnected) {
    statusElement.textContent = 'Vault connected';
    statusElement.className = 'status connected';
    runScoutButton.disabled = false;
  } else {
    statusElement.textContent = 'Vault offline - start Nexus Vault desktop app';
    statusElement.className = 'status disconnected';
    runScoutButton.disabled = true;
  }
}

// Run Travel Scout
async function runTravelScout() {
  try {
    // Get calendar events
    const calendarResponse = await fetch(`${VAULT_API_URL}/read-memory?scope=calendar.read`);
    const calendarData = await calendarResponse.json();

    // Get flight history
    const flightResponse = await fetch(`${VAULT_API_URL}/read-memory?scope=flight-history.read`);
    const flightData = await flightResponse.json();

    // TODO: Process and display the data
    console.log('Calendar data:', calendarData);
    console.log('Flight data:', flightData);
  } catch (error) {
    console.error('Failed to run Travel Scout:', error);
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initial status check
  updateConnectionStatus();
  
  // Set up periodic status checks
  setInterval(updateConnectionStatus, CHECK_INTERVAL);

  // Button click handlers
  runScoutButton.addEventListener('click', runTravelScout);
  
  manageMemoryButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'options.html#memory' });
  });
  
  optionsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'options.html' });
  });
}); 