import Docker from "dockerode";
import { Agent } from "@synqai/shared";

const docker = new Docker();

export const setupDocker = async () => {
  try {
    await docker.ping();
    console.log("Docker daemon is running");
  } catch (error) {
    console.error("Docker daemon is not running:", error);
    process.exit(1);
  }
};

export const startAgent = async (agent: Agent): Promise<string> => {
  try {
    // Pull the agent's container image
    await docker.pull(agent.container.image);

    // Create and start the container
    const container = await docker.createContainer({
      Image: agent.container.image,
      ExposedPorts: {
        [`${agent.container.port}/tcp`]: {},
      },
      HostConfig: {
        PortBindings: {
          [`${agent.container.port}/tcp`]: [{ HostPort: "0" }],
        },
      },
      Env: Object.entries(agent.container.env || {}).map(
        ([key, value]) => `${key}=${value}`
      ),
      Labels: {
        "com.synqai.agent": "true",
      },
    });

    await container.start();

    // Get the assigned host port
    const containerInfo = await container.inspect();
    const hostPort =
      containerInfo.NetworkSettings.Ports[`${agent.container.port}/tcp`][0]
        .HostPort;

    return hostPort;
  } catch (error) {
    console.error(`Failed to start agent ${agent.id}:`, error);
    throw error;
  }
};

export const stopAgent = async (containerId: string): Promise<void> => {
  try {
    const container = docker.getContainer(containerId);
    await container.stop();
    await container.remove();
  } catch (error) {
    console.error(`Failed to stop container ${containerId}:`, error);
    throw error;
  }
};

export const listRunningAgents = async (): Promise<any[]> => {
  try {
    const containers = await docker.listContainers();
    return containers.filter(
      (container) => container.Labels["com.synqai.agent"] === "true"
    );
  } catch (error) {
    console.error("Failed to list running agents:", error);
    throw error;
  }
};

export const getAgentLogs = async (containerId: string): Promise<string> => {
  try {
    const container = docker.getContainer(containerId);
    const logs = await container.logs({
      follow: false,
      stdout: true,
      stderr: true,
    });
    return logs.toString();
  } catch (error) {
    console.error(`Failed to get logs for container ${containerId}:`, error);
    throw error;
  }
};
