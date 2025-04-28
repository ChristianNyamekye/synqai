import { useState } from "react";
import { useQuery } from "react-query";
import { Agent } from "@synqai/shared";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// API client
const API_BASE_URL = "http://localhost:42715";

async function fetchAgents(): Promise<Agent[]> {
  const response = await fetch(`${API_BASE_URL}/agents`);
  const data = await response.json();
  return data.data;
}

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  const {
    data: agents,
    isLoading,
    error,
  } = useQuery<Agent[]>("agents", fetchAgents);

  const handleInstall = async (agent: Agent) => {
    setSelectedAgent(agent);
    setIsPermissionDialogOpen(true);
  };

  const handleGrantPermission = async () => {
    if (!selectedAgent) return;

    try {
      const response = await fetch(`${API_BASE_URL}/register-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedAgent),
      });

      if (response.ok) {
        setIsPermissionDialogOpen(false);
        // Refresh the agents list
        // TODO: Implement refresh logic
      }
    } catch (error) {
      console.error("Failed to install agent:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">Failed to load agents</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">SynqAI</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agents?.map((agent) => (
              <div
                key={agent.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {agent.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {agent.description}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => handleInstall(agent)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Install
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Dialog
        open={isPermissionDialogOpen}
        onClose={() => setIsPermissionDialogOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={() => setIsPermissionDialogOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <Dialog.Title className="text-lg font-medium text-gray-900">
              Grant Permissions
            </Dialog.Title>

            <div className="mt-4">
              <p className="text-sm text-gray-500">
                {selectedAgent?.name} requires the following permissions:
              </p>
              <ul className="mt-2 text-sm text-gray-500">
                {selectedAgent?.requiredScopes.map((scope) => (
                  <li key={scope}>{scope}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGrantPermission}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Grant Permissions
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
