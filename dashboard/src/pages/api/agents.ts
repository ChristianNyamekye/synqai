import { NextApiRequest, NextApiResponse } from "next";
import { Agent } from "@synqai/shared";

// Mock data for development
const mockAgents: Agent[] = [
  {
    id: "travel-scout",
    name: "Travel Scout",
    description:
      "AI travel assistant that helps plan your trips based on your preferences and schedule.",
    version: "1.0.0",
    requiredScopes: ["calendar.read", "browse-history.read"],
    optionalScopes: ["files.read"],
    price: 9.99,
    subscription: true,
    container: {
      image: "synqai/travel-scout:latest",
      port: 3000,
    },
  },
  {
    id: "book-finder",
    name: "Book Origin Finder",
    description:
      "Discovers the original sources and inspirations for your favorite books.",
    version: "1.0.0",
    requiredScopes: ["browse-history.read"],
    optionalScopes: ["notes.read"],
    price: 4.99,
    subscription: false,
    container: {
      image: "synqai/book-finder:latest",
      port: 3000,
    },
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // In production, fetch from the local host
    // const response = await fetch('http://localhost:42715/agents');
    // const data = await response.json();
    // return res.status(200).json(data);

    // For development, return mock data
    return res.status(200).json({ success: true, data: mockAgents });
  }

  if (req.method === "POST") {
    try {
      const agent = req.body as Agent;

      // In production, register with the local host
      // const response = await fetch('http://localhost:42715/register-agent', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(agent)
      // });
      // const data = await response.json();
      // return res.status(200).json(data);

      // For development, just return success
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to register agent",
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { agentId } = req.body;

      // In production, unregister from the local host
      // const response = await fetch('http://localhost:42715/unregister-agent', {
      //   method: 'DELETE',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ agentId })
      // });
      // const data = await response.json();
      // return res.status(200).json(data);

      // For development, just return success
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to unregister agent",
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: "Method not allowed",
  });
}
