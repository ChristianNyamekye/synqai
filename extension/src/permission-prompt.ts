import { Scope } from "@synqai/shared";

interface PermissionPromptOptions {
  scope: Scope;
  description: string;
  fields: string[];
  appName: string;
}

export async function promptForScope(options: PermissionPromptOptions): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if permission is already granted
    chrome.storage.local.get(['grantedScopes'], (result) => {
      const grantedScopes = result.grantedScopes || {};
      if (grantedScopes[options.scope]) {
        resolve(true);
        return;
      }

      // Create and show the permission prompt
      const prompt = document.createElement('div');
      prompt.className = 'permission-prompt';
      prompt.innerHTML = `
        <style>
          .permission-prompt {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            z-index: 10000;
          }
          .permission-prompt h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
          }
          .permission-prompt p {
            margin: 0 0 15px 0;
            color: #666;
            font-size: 14px;
          }
          .permission-prompt .fields {
            margin-bottom: 15px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
          }
          .permission-prompt .field-item {
            margin-bottom: 5px;
            font-size: 14px;
          }
          .permission-prompt .buttons {
            display: flex;
            gap: 10px;
          }
          .permission-prompt button {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          .permission-prompt .allow {
            background: #1a73e8;
            color: white;
          }
          .permission-prompt .deny {
            background: #f1f3f4;
            color: #3c4043;
          }
        </style>
        <h3>${options.appName} wants to access:</h3>
        <p>${options.description}</p>
        <div class="fields">
          ${options.fields.map(field => `
            <div class="field-item">• ${field}</div>
          `).join('')}
        </div>
        <div class="buttons">
          <button class="deny">Deny</button>
          <button class="allow">Allow</button>
        </div>
      `;

      // Add event listeners
      prompt.querySelector('.allow')?.addEventListener('click', () => {
        document.body.removeChild(prompt);
        // Update granted scopes
        chrome.storage.local.get(['grantedScopes'], (result) => {
          const grantedScopes = result.grantedScopes || {};
          grantedScopes[options.scope] = true;
          chrome.storage.local.set({ grantedScopes });
          resolve(true);
        });
      });

      prompt.querySelector('.deny')?.addEventListener('click', () => {
        document.body.removeChild(prompt);
        resolve(false);
      });

      // Add to document
      document.body.appendChild(prompt);
    });
  });
} 