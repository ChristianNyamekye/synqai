import express from "express";
import { createApiResponse, hasPermission } from "@synqai/shared";
import { getMemory, storeMemory } from "./database";
import { getPermissions } from "./permissions";

const app = express();
app.use(express.json());

// Middleware to validate agent permissions
const validatePermissions = async (
  req: express.Request,
  res: express.Response,
  next: express.Function
) => {
  const agentId = req.headers["x-agent-id"] as string;
  const scope = req.query.scope as string;

  if (!agentId || !scope) {
    return res
      .status(400)
      .json(createApiResponse(false, null, "Missing agent ID or scope"));
  }

  const permissions = await getPermissions(agentId);
  if (!hasPermission(permissions, agentId, scope)) {
    return res
      .status(403)
      .json(createApiResponse(false, null, "Permission denied"));
  }

  next();
};

// Memory store endpoints
app.get("/read-memory", validatePermissions, async (req, res) => {
  try {
    const { scope } = req.query;
    const data = await getMemory(scope as string);
    res.json(createApiResponse(true, data));
  } catch (error) {
    res.status(500).json(createApiResponse(false, null, error.message));
  }
});

app.post("/write-memory", validatePermissions, async (req, res) => {
  try {
    const { scope, data } = req.body;
    await storeMemory(scope, data);
    res.json(createApiResponse(true));
  } catch (error) {
    res.status(500).json(createApiResponse(false, null, error.message));
  }
});

// Agent management endpoints
app.post("/register-agent", async (req, res) => {
  try {
    const { agentId, scopes } = req.body;
    // TODO: Implement agent registration
    res.json(createApiResponse(true));
  } catch (error) {
    res.status(500).json(createApiResponse(false, null, error.message));
  }
});

app.delete("/unregister-agent", async (req, res) => {
  try {
    const { agentId } = req.body;
    // TODO: Implement agent unregistration
    res.json(createApiResponse(true));
  } catch (error) {
    res.status(500).json(createApiResponse(false, null, error.message));
  }
});

export const setupApiServer = () => {
  const port = process.env.PORT || 42715;
  app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });
};
