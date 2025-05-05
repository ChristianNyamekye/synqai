// DOM Elements
const connectedAppsList = document.getElementById('connectedApps') as HTMLUListElement;
const scopeList = document.getElementById('scopeList') as HTMLUListElement;
const exportButton = document.getElementById('exportData') as HTMLButtonElement;
const importButton = document.getElementById('importData') as HTMLButtonElement;
const clearButton = document.getElementById('clearData') as HTMLButtonElement;

// Constants
const SCOPES = [
  {
    id: 'calendar.read',
    name: 'Calendar Events',
    description: 'Access to your calendar events and schedules',
    fields: ['Event titles', 'Dates', 'Locations']
  },
  {
    id: 'flight-history.read',
    name: 'Flight History',
    description: 'Access to your flight search history and preferences',
    fields: ['Destinations', 'Dates', 'Preferences']
  }
];

// Load and display connected apps
async function loadConnectedApps() {
  const { connectedApps } = await chrome.storage.local.get('connectedApps');
  const apps = connectedApps || [];

  connectedAppsList.innerHTML = apps.map(app => `
    <li class="scope-item">
      <div class="scope-info">
        <div class="scope-name">${app.name}</div>
        <div class="scope-description">${app.description}</div>
      </div>
      <button class="disconnect" data-app-id="${app.id}">Disconnect</button>
    </li>
  `).join('');

  // Add disconnect handlers
  document.querySelectorAll('.disconnect').forEach(button => {
    button.addEventListener('click', async (e) => {
      const appId = (e.target as HTMLElement).dataset.appId;
      await disconnectApp(appId!);
      loadConnectedApps();
    });
  });
}

// Load and display scopes
async function loadScopes() {
  const { grantedScopes } = await chrome.storage.local.get('grantedScopes');
  const scopes = grantedScopes || {};

  scopeList.innerHTML = SCOPES.map(scope => `
    <li class="scope-item">
      <div class="scope-info">
        <div class="scope-name">${scope.name}</div>
        <div class="scope-description">${scope.description}</div>
      </div>
      <label class="toggle">
        <input type="checkbox" ${scopes[scope.id] ? 'checked' : ''} data-scope-id="${scope.id}">
        <span class="slider"></span>
      </label>
    </li>
  `).join('');

  // Add toggle handlers
  document.querySelectorAll('.toggle input').forEach(toggle => {
    toggle.addEventListener('change', async (e) => {
      const scopeId = (e.target as HTMLInputElement).dataset.scopeId;
      const isGranted = (e.target as HTMLInputElement).checked;
      await updateScopePermission(scopeId!, isGranted);
    });
  });
}

// Disconnect an app
async function disconnectApp(appId: string) {
  const { connectedApps } = await chrome.storage.local.get('connectedApps');
  const apps = connectedApps || [];
  const updatedApps = apps.filter((app: any) => app.id !== appId);
  await chrome.storage.local.set({ connectedApps: updatedApps });
}

// Update scope permission
async function updateScopePermission(scopeId: string, isGranted: boolean) {
  const { grantedScopes } = await chrome.storage.local.get('grantedScopes');
  const scopes = grantedScopes || {};
  scopes[scopeId] = isGranted;
  await chrome.storage.local.set({ grantedScopes: scopes });
}

// Export memory data
async function exportMemory() {
  const { memory } = await chrome.storage.local.get('memory');
  const data = JSON.stringify(memory || {}, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nexus-vault-memory.json';
  a.click();
  
  URL.revokeObjectURL(url);
}

// Import memory data
async function importMemory(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        await chrome.storage.local.set({ memory: data });
        alert('Memory imported successfully!');
      } catch (error) {
        alert('Failed to import memory: Invalid file format');
      }
    };
    reader.readAsText(file);
  }
}

// Clear all data
async function clearAllData() {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    await chrome.storage.local.clear();
    loadConnectedApps();
    loadScopes();
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadConnectedApps();
  loadScopes();

  exportButton.addEventListener('click', exportMemory);
  
  importButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', importMemory);
    input.click();
  });
  
  clearButton.addEventListener('click', clearAllData);
}); 