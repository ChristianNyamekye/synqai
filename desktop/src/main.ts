import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { setupApiServer } from "./api";
import { setupDatabase } from "./database";
import { setupDocker } from "./docker";

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the app
  if (process.env.NODE_ENV === "development") {
    await mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  // Initialize core services
  await setupDatabase();
  await setupDocker();
  await setupApiServer();

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle("get-permissions", async (event, agentId: string) => {
  // TODO: Implement permission retrieval
  return [];
});

ipcMain.handle(
  "grant-permission",
  async (event, agentId: string, scopes: string[]) => {
    // TODO: Implement permission granting
    return true;
  }
);

ipcMain.handle(
  "revoke-permission",
  async (event, agentId: string, scopes: string[]) => {
    // TODO: Implement permission revocation
    return true;
  }
);
