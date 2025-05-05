import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Expose any necessary APIs here
  onUpdateMemory: (callback: (data: any) => void) => {
    ipcRenderer.on('update-memory', (_, data) => callback(data));
  },
  // Add more APIs as needed
}); 